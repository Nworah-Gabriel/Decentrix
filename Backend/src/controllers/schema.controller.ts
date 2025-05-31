import { Request, Response, NextFunction } from 'express';
import { 
    createSchemaOnSui, 
    getSuiObject, 
    getAllSchemasFromSui, 
    getAllSchemasWithRetry,
    getSchemasByOwner 
} from '../services/sui.service';
import { config } from '../config';
import { dbService } from '../services/db.service';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { fromB64 } from '@mysten/sui.js/utils';

// Types for better type safety
interface CreateSchemaRequest {
    name: string;
    description: string;
    definitionJson: string;
}

interface SchemaQueryParams {
    limit?: string;
    cursor?: string;
    owner?: string;
    retry?: string;
}

interface SchemaResponse {
    objectId: string;
    name?: string;
    description?: string;
    definitionJson?: string;
    creator?: string;
    timestamp?: string;
    type?: string;
    owner?: any;
    previousTransaction?: string;
    version?: string;
    digest?: string;
    suiObjectLink?: string;
}

interface PaginatedSchemaResponse {
    schemas: SchemaResponse[];
    pagination: {
        limit: number;
        hasNextPage: boolean;
        nextCursor: string | null;
        totalCount?: number;
    };
    metadata?: {
        requestId: string;
        timestamp: string;
        processingTimeMs: number;
    };
}

// Utility functions
const getExplorerUrl = (objectId: string): string =>
    `${config.isTestnet ? 'https://suiscan.xyz/testnet' : 'https://suiscan.xyz/mainnet'}/object/${objectId}`;

const generateRequestId = (): string => 
    `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const validateJsonString = (jsonString: string): { isValid: boolean; error?: string } => {
    try {
        const parsed = JSON.parse(jsonString);
        if (typeof parsed !== 'object' || parsed === null) {
            return { isValid: false, error: 'JSON must be an object' };
        }
        return { isValid: true };
    } catch (error: any) {
        return { isValid: false, error: `Invalid JSON: ${error.message}` };
    }
};

const validateObjectId = (objectId: string): { isValid: boolean; error?: string } => {
    if (!objectId || typeof objectId !== 'string') {
        return { isValid: false, error: 'Object ID is required and must be a string' };
    }
    
    // Basic Sui object ID validation (should be hex string of specific length)
    const hexPattern = /^0x[a-fA-F0-9]{64}$/;
    if (!hexPattern.test(objectId)) {
        return { isValid: false, error: 'Invalid Sui object ID format' };
    }
    
    return { isValid: true };
};

const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
};

// Enhanced schema creation with comprehensive validation
export const createSchema = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    
    try {
        console.log(`[${requestId}] Schema creation request started`);
        
        const { name, description, definitionJson }: CreateSchemaRequest = req.body;

        // Input validation
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            res.status(400).json({ 
                error: 'Schema name is required and must be a non-empty string',
                requestId 
            });
            return;
        }

        if (!description || typeof description !== 'string' || description.trim().length === 0) {
            res.status(400).json({ 
                error: 'Schema description is required and must be a non-empty string',
                requestId 
            });
            return;
        }

        if (!definitionJson || typeof definitionJson !== 'string') {
            res.status(400).json({ 
                error: 'Schema definitionJson is required and must be a string',
                requestId 
            });
            return;
        }

        // Validate JSON structure
        const jsonValidation = validateJsonString(definitionJson);
        if (!jsonValidation.isValid) {
            res.status(400).json({ 
                error: `Invalid definitionJson: ${jsonValidation.error}`,
                requestId 
            });
            return;
        }

        // Sanitize inputs
        const sanitizedName = sanitizeInput(name);
        const sanitizedDescription = sanitizeInput(description);

        // Length validation
        if (sanitizedName.length > 100) {
            res.status(400).json({ 
                error: 'Schema name must be 100 characters or less',
                requestId 
            });
            return;
        }

        if (sanitizedDescription.length > 500) {
            res.status(400).json({ 
                error: 'Schema description must be 500 characters or less',
                requestId 
            });
            return;
        }

        if (definitionJson.length > 10000) {
            res.status(400).json({ 
                error: 'Schema definitionJson must be 10,000 characters or less',
                requestId 
            });
            return;
        }

        console.log(`[${requestId}] Creating schema with name: "${sanitizedName}"`);

        // Create schema on blockchain
        const result = await createSchemaOnSui(sanitizedName, sanitizedDescription, definitionJson);
        
        // Store in database
        if (result.createdObjectId) {
            await dbService.createSchema({
                objectId: result.createdObjectId,
                name: sanitizedName,
                description: sanitizedDescription,
                definitionJson: definitionJson,
                creator: getKeypair().getPublicKey().toSuiAddress(),
                timestamp: new Date(),
                transactionDigest: result.transactionDigest
            });
        }

        const processingTime = Date.now() - startTime;
        console.log(`[${requestId}] Schema creation completed in ${processingTime}ms`);

        const response = {
            message: 'Schema creation transaction submitted successfully',
            transactionDigest: result.transactionDigest,
            schemaObjectId: result.createdObjectId,
            suiObjectLink: result.createdObjectId ? getExplorerUrl(result.createdObjectId) : null,
            metadata: {
                requestId,
                timestamp: new Date().toISOString(),
                processingTimeMs: processingTime
            }
        };

        res.status(201).json(response);
    } catch (error: any) {
        const processingTime = Date.now() - startTime;
        console.error(`[${requestId}] Schema creation failed after ${processingTime}ms:`, error);
        
        // Enhanced error handling
        if (error.message?.includes('gas')) {
            res.status(400).json({ 
                error: 'Transaction failed due to insufficient gas or gas limit exceeded',
                requestId,
                details: 'Please try again or contact support if the issue persists'
            });
            return;
        }
        
        if (error.message?.includes('private key')) {
            res.status(500).json({ 
                error: 'Server configuration error',
                requestId 
            });
            return;
        }
        
        next(error);
    }
};

// Enhanced schema retrieval by ID
export const getSchemaById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    
    try {
        const { objectId } = req.params;
        
        console.log(`[${requestId}] Fetching schema by ID: ${objectId}`);

        // Validate object ID format
        const validation = validateObjectId(objectId);
        if (!validation.isValid) {
            res.status(400).json({ 
                error: validation.error,
                requestId 
            });
            return;
        }

        const schemaData = await getSuiObject(objectId);
        
        const processingTime = Date.now() - startTime;
        console.log(`[${requestId}] Schema retrieval completed in ${processingTime}ms`);

        const response = {
            ...schemaData,
            suiObjectLink: getExplorerUrl(objectId),
            metadata: {
                requestId,
                timestamp: new Date().toISOString(),
                processingTimeMs: processingTime
            }
        };

        res.status(200).json(response);
    } catch (error: any) {
        const processingTime = Date.now() - startTime;
        console.error(`[${requestId}] Schema retrieval failed after ${processingTime}ms:`, error);
        
        if (error.message?.includes('not found') || error.message?.includes('no data')) {
            res.status(404).json({ 
                error: `Schema with ID ${req.params.objectId} not found`,
                requestId 
            });
            return;
        }
        
        next(error);
    }
};

// Enhanced schema listing with multiple query options
export const getAllSchemas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    
    try {
        const { 
            limit = '10', 
            cursor, 
            owner, 
            retry = 'false' 
        }: SchemaQueryParams = req.query;

        console.log(`[${requestId}] Fetching schemas with params:`, { limit, cursor, owner, retry });

        // Validate limit
        const limitNum = parseInt(limit, 10);
        if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
            res.status(400).json({ 
                error: 'Limit must be a positive integer between 1 and 100',
                requestId 
            });
            return;
        }

        // Validate owner address if provided
        if (owner && typeof owner === 'string') {
            const ownerValidation = validateObjectId(owner);
            if (!ownerValidation.isValid) {
                res.status(400).json({ 
                    error: 'Invalid owner address format',
                    requestId 
                });
                return;
            }
        }

        let result;
        
        // Choose appropriate service method based on query parameters
        if (owner) {
            console.log(`[${requestId}] Fetching schemas by owner: ${owner}`);
            result = await getSchemasByOwner(owner, limitNum, cursor);
        } else if (retry === 'true') {
            console.log(`[${requestId}] Fetching schemas with retry logic`);
            result = await getAllSchemasWithRetry(limitNum, cursor);
        } else {
            console.log(`[${requestId}] Fetching all schemas`);
            result = await getAllSchemasFromSui(limitNum, cursor);
        }

        // Add explorer links to each schema
        const schemasWithLinks: SchemaResponse[] = result.data.map(schema => ({
            ...schema,
            suiObjectLink: schema.objectId ? getExplorerUrl(schema.objectId) : null
        }));

        const processingTime = Date.now() - startTime;
        console.log(`[${requestId}] Schema listing completed in ${processingTime}ms, found ${schemasWithLinks.length} schemas`);

        const response: PaginatedSchemaResponse = {
            schemas: schemasWithLinks,
            pagination: {
                limit: limitNum,
                hasNextPage: result.hasNextPage,
                nextCursor: result.nextCursor,
                totalCount: schemasWithLinks.length
            },
            metadata: {
                requestId,
                timestamp: new Date().toISOString(),
                processingTimeMs: processingTime
            }
        };

        res.status(200).json(response);
    } catch (error: any) {
        const processingTime = Date.now() - startTime;
        console.error(`[${requestId}] Schema listing failed after ${processingTime}ms:`, error);
        
        // Handle specific error cases
        if (error.message?.includes('rate limit')) {
            res.status(429).json({ 
                error: 'Rate limit exceeded. Please try again later.',
                requestId,
                retryAfter: 60
            });
            return;
        }
        
        if (error.message?.includes('timeout')) {
            res.status(504).json({ 
                error: 'Request timeout. The blockchain network may be experiencing high load.',
                requestId,
                suggestion: 'Try using the retry=true parameter for better reliability'
            });
            return;
        }
        
        next(error);
    }
};

// New endpoint: Get schema statistics
export const getSchemaStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    
    try {
        console.log(`[${requestId}] Fetching schema statistics`);
        
        // Get a larger sample to calculate stats
        const result = await getAllSchemasFromSui(50);
        
        const stats = {
            totalSchemas: result.data.length,
            hasMoreSchemas: result.hasNextPage,
            recentSchemas: result.data.slice(0, 5).map(schema => ({
                objectId: schema.objectId,
                name: schema.name,
                creator: schema.creator,
                timestamp: schema.timestamp
            })),
            uniqueCreators: [...new Set(result.data.map(s => s.creator).filter(Boolean))].length
        };
        
        const processingTime = Date.now() - startTime;
        console.log(`[${requestId}] Schema statistics completed in ${processingTime}ms`);

        res.status(200).json({
            ...stats,
            metadata: {
                requestId,
                timestamp: new Date().toISOString(),
                processingTimeMs: processingTime
            }
        });
    } catch (error: any) {
        const processingTime = Date.now() - startTime;
        console.error(`[${requestId}] Schema statistics failed after ${processingTime}ms:`, error);
        next(error);
    }
};

// Health check endpoint for schema service
export const getSchemaServiceHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    
    try {
        console.log(`[${requestId}] Checking schema service health`);
        
        // Try to fetch a small number of schemas to test connectivity
        const result = await getAllSchemasFromSui(1);
        
        const processingTime = Date.now() - startTime;
        
        const health = {
            status: 'healthy',
            services: {
                sui: 'connected',
                blockchain: result.data.length >= 0 ? 'accessible' : 'limited'
            },
            lastCheck: new Date().toISOString(),
            responseTimeMs: processingTime
        };

        res.status(200).json({
            ...health,
            metadata: {
                requestId,
                timestamp: new Date().toISOString(),
                processingTimeMs: processingTime
            }
        });
    } catch (error: any) {
        const processingTime = Date.now() - startTime;
        console.error(`[${requestId}] Schema service health check failed after ${processingTime}ms:`, error);
        
        res.status(503).json({
            status: 'unhealthy',
            services: {
                sui: 'error',
                blockchain: 'unreachable'
            },
            error: error.message,
            lastCheck: new Date().toISOString(),
            responseTimeMs: processingTime,
            metadata: {
                requestId,
                timestamp: new Date().toISOString(),
                processingTimeMs: processingTime
            }
        });
    }
};

function getKeypair(): Ed25519Keypair {
    // Option 1: Load from environment variable (recommended for production)
    const privateKeyB64 = process.env.SUI_PRIVATE_KEY;
    if (!privateKeyB64) {
        throw new Error('SUI_PRIVATE_KEY environment variable is not set');
    }
    
    try {
        // Decode the base64 private key and create keypair
        const privateKeyBytes = fromB64(privateKeyB64);
        return Ed25519Keypair.fromSecretKey(privateKeyBytes);
    } catch (error) {
        throw new Error('Invalid private key format in SUI_PRIVATE_KEY environment variable');
    }
}

// Alternative implementation if you want to generate a new keypair (for testing only)
function generateNewKeypair(): Ed25519Keypair {
    return new Ed25519Keypair();
}
