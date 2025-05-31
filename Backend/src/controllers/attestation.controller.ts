import { Request, Response, NextFunction } from 'express';
import { 
    createAttestationOnSui, 
    getSuiObject, 
    getAllAttestationsFromSui,
    getAttestationsByOwner 
} from '../services/sui.service';
import { sha256Hash } from '../utils/hashing';
import { config } from '../config';

// Types for better type safety
interface CreateAttestationRequest {
    subjectAddress?: string;
    dataToAttest: string;
    schemaObjectId: string;
}

interface GetAttestationsQuery {
    page?: string;
    limit?: string;
    cursor?: string;
    owner?: string;
}

interface AttestationResponse {
    message: string;
    transactionDigest: string;
    attestationObjectId: string | null;
    suiObjectLink: string | null;
    metadata?: {
        dataHash: string;
        schemaObjectId: string;
        subjectAddress?: string;
    };
}

interface PaginatedAttestationsResponse {
    message: string;
    data: any[];
    hasNextPage: boolean;
    nextCursor: string | null;
    pagination: {
        page: number;
        limit: number;
        total?: number;
    };
    metadata: {
        queryType: 'all' | 'byOwner';
        owner?: string;
    };
}

// Helper functions
const getExplorerUrl = (objectId: string): string =>
    `${config.isTestnet ? 'https://suiscan.xyz/testnet' : 'https://suiscan.xyz/mainnet'}/object/${objectId}`;

const isValidSuiAddress = (address: string): boolean => {
    return typeof address === 'string' && 
           address.startsWith('0x') && 
           address.length >= 42 && 
           /^0x[a-fA-F0-9]+$/.test(address);
};

const validatePaginationParams = (page?: string, limit?: string) => {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    if (isNaN(pageNum) || pageNum < 1) {
        throw new Error('Page must be a positive integer');
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        throw new Error('Limit must be a positive integer between 1 and 100');
    }

    return { pageNum, limitNum };
};

// Controller functions
export const createAttestation = async (
    req: Request<{}, AttestationResponse, CreateAttestationRequest>, 
    res: Response<AttestationResponse>, 
    next: NextFunction
): Promise<void> => {
    const startTime = Date.now();
    const { subjectAddress, dataToAttest, schemaObjectId } = req.body;

    console.log('Creating attestation with params:', {
        hasSubjectAddress: !!subjectAddress,
        dataLength: dataToAttest?.length || 0,
        schemaObjectId,
        timestamp: new Date().toISOString()
    });

    try {
        // Enhanced validation
        if (!dataToAttest || typeof dataToAttest !== 'string' || dataToAttest.trim().length === 0) {
            res.status(400).json({ 
                message: 'Validation failed',
                error: 'dataToAttest must be a non-empty string',
                transactionDigest: '',
                attestationObjectId: null,
                suiObjectLink: null
            } as any);
            return;
        }

        if (!schemaObjectId || !isValidSuiAddress(schemaObjectId)) {
            res.status(400).json({ 
                message: 'Validation failed',
                error: 'schemaObjectId must be a valid Sui Object ID',
                transactionDigest: '',
                attestationObjectId: null,
                suiObjectLink: null
            } as any);
            return;
        }

        if (subjectAddress && !isValidSuiAddress(subjectAddress)) {
            res.status(400).json({ 
                message: 'Validation failed',
                error: 'subjectAddress must be a valid Sui address if provided',
                transactionDigest: '',
                attestationObjectId: null,
                suiObjectLink: null
            } as any);
            return;
        }

        // Validate that the schema exists before creating attestation
        try {
            await getSuiObject(schemaObjectId);
            console.log(`Schema ${schemaObjectId} validated successfully`);
        } catch (schemaError: any) {
            console.error(`Schema validation failed for ${schemaObjectId}:`, schemaError.message);
            res.status(400).json({
                message: 'Schema validation failed',
                error: `Schema with ID ${schemaObjectId} not found or inaccessible`,
                transactionDigest: '',
                attestationObjectId: null,
                suiObjectLink: null
            } as any);
            return;
        }

        // Create attestation
        const dataHashBytes = sha256Hash(dataToAttest);
        const dataHashHex = Buffer.from(dataHashBytes).toString('hex');
        
        console.log(`Creating attestation with data hash: 0x${dataHashHex}`);
        
        const result = await createAttestationOnSui(
            subjectAddress || '', 
            dataHashBytes, 
            schemaObjectId
        );

        const duration = Date.now() - startTime;
        console.log(`Attestation created successfully in ${duration}ms:`, {
            transactionDigest: result.transactionDigest,
            attestationObjectId: result.createdObjectId,
            dataHash: `0x${dataHashHex}`
        });

        const response: AttestationResponse = {
            message: 'Attestation created successfully',
            transactionDigest: result.transactionDigest,
            attestationObjectId: result.createdObjectId,
            suiObjectLink: result.createdObjectId ? getExplorerUrl(result.createdObjectId) : null,
            metadata: {
                dataHash: `0x${dataHashHex}`,
                schemaObjectId,
                ...(subjectAddress && { subjectAddress })
            }
        };

        res.status(201).json(response);
        
    } catch (error: any) {
        const duration = Date.now() - startTime;
        console.error(`Attestation creation failed after ${duration}ms:`, {
            error: error.message,
            stack: error.stack,
            schemaObjectId,
            hasSubjectAddress: !!subjectAddress
        });
        next(error);
    }
};

export const getAllAttestations = async (
    req: Request<{}, PaginatedAttestationsResponse, {}, GetAttestationsQuery>, 
    res: Response<PaginatedAttestationsResponse>, 
    next: NextFunction
): Promise<void> => {
    const startTime = Date.now();
    const { page, limit, cursor, owner } = req.query;

    console.log('Fetching attestations with params:', {
        page,
        limit,
        cursor: cursor ? `${cursor.substring(0, 10)}...` : undefined,
        owner,
        timestamp: new Date().toISOString()
    });

    try {
        const { pageNum, limitNum } = validatePaginationParams(page, limit);

        // Validate owner address if provided
        if (owner && !isValidSuiAddress(owner)) {
            res.status(400).json({
                message: 'Validation failed',
                error: 'Owner must be a valid Sui address if provided',
                data: [],
                hasNextPage: false,
                nextCursor: null,
                pagination: { page: pageNum, limit: limitNum },
                metadata: { queryType: 'all' }
            } as any);
            return;
        }

        let result;
        let queryType: 'all' | 'byOwner';

        if (owner) {
            console.log(`Fetching attestations by owner: ${owner}`);
            result = await getAttestationsByOwner(owner, limitNum, cursor);
            queryType = 'byOwner';
        } else {
            console.log('Fetching all attestations');
            result = await getAllAttestationsFromSui(limitNum, cursor);
            queryType = 'all';
        }

        const duration = Date.now() - startTime;
        console.log(`Attestations fetched successfully in ${duration}ms:`, {
            count: result.data.length,
            hasNextPage: result.hasNextPage,
            queryType,
            owner
        });

        const response: PaginatedAttestationsResponse = {
            message: `Attestations retrieved successfully`,
            data: result.data.map(attestation => ({
                ...attestation,
                suiObjectLink: attestation.objectId ? getExplorerUrl(attestation.objectId) : null
            })),
            hasNextPage: result.hasNextPage,
            nextCursor: result.nextCursor,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: result.data.length
            },
            metadata: {
                queryType,
                ...(owner && { owner })
            }
        };

        res.status(200).json(response);
        
    } catch (error: any) {
        const duration = Date.now() - startTime;
        console.error(`Failed to fetch attestations after ${duration}ms:`, {
            error: error.message,
            stack: error.stack,
            page,
            limit,
            owner
        });
        next(error);
    }
};

export const getAttestationById = async (
    req: Request<{ objectId: string }>, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    const startTime = Date.now();
    const { objectId } = req.params;
    
    console.log(`Fetching attestation by ID: ${objectId}`);

    try {
        // Enhanced validation
        if (!objectId || !isValidSuiAddress(objectId)) {
            res.status(400).json({ 
                error: 'Valid Sui object ID is required',
                message: 'Invalid object ID format'
            });
            return;
        }
        
        const attestationData = await getSuiObject(objectId);
        
        const duration = Date.now() - startTime;
        console.log(`Attestation fetched successfully in ${duration}ms:`, {
            objectId,
            hasContent: !!attestationData.content
        });

        // Enhance response with additional metadata
        const enhancedData = {
            ...attestationData,
            suiObjectLink: getExplorerUrl(objectId),
            metadata: {
                fetchedAt: new Date().toISOString(),
                objectId,
                isTestnet: config.isTestnet
            }
        };

        res.status(200).json(enhancedData);
        
    } catch (error: any) {
        const duration = Date.now() - startTime;
        console.error(`Failed to fetch attestation after ${duration}ms:`, {
            error: error.message,
            objectId
        });

        if (error.message?.includes('not found') || error.message?.includes('no data')) {
            res.status(404).json({ 
                error: `Attestation with ID ${objectId} not found`,
                message: 'Object not found on the blockchain',
                objectId
            });
        } else {
            next(error);
        }
    }
};

// Additional helper endpoint to get attestation statistics
export const getAttestationStats = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    const startTime = Date.now();
    
    console.log('Fetching attestation statistics');

    try {
        // Get a larger sample to calculate stats
        const result = await getAllAttestationsFromSui(100);
        
        const stats = {
            totalFetched: result.data.length,
            hasMore: result.hasNextPage,
            uniqueSchemas: new Set(result.data.map(a => a.schemaId)).size,
            uniqueAttestors: new Set(result.data.map(a => a.attestor)).size,
            recentAttestations: result.data.slice(0, 5).map(a => ({
                objectId: a.objectId,
                timestamp: a.timestamp,
                attestor: a.attestor
            })),
            metadata: {
                generatedAt: new Date().toISOString(),
                isTestnet: config.isTestnet,
                networkRpc: config.suiRpcUrl
            }
        };

        const duration = Date.now() - startTime;
        console.log(`Attestation stats generated in ${duration}ms:`, {
            totalFetched: stats.totalFetched,
            uniqueSchemas: stats.uniqueSchemas,
            uniqueAttestors: stats.uniqueAttestors
        });

        res.status(200).json({
            message: 'Attestation statistics retrieved successfully',
            stats
        });
        
    } catch (error: any) {
        const duration = Date.now() - startTime;
        console.error(`Failed to generate attestation stats after ${duration}ms:`, error.message);
        next(error);
    }
};