import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { fromHEX } from '@mysten/sui.js/utils';
import { config } from '../config'; 
import { decodeSuiPrivateKey } from '@mysten/sui.js/cryptography';

let suiClientInstance: SuiClient;
let keypairInstance: Ed25519Keypair;

function getSuiClient(): SuiClient {
    if (!suiClientInstance) {
        suiClientInstance = new SuiClient({ url: config.suiRpcUrl });
    }
    return suiClientInstance;
}

function getKeypair(): Ed25519Keypair {
    if (!keypairInstance) {
        if (!config.suiPrivateKeyHex) {
            throw new Error('Sui private key not configured.');
        }
        
        try {
            // Method 1: Try decoding the suiprivkey1... format
            const decoded = decodeSuiPrivateKey(config.suiPrivateKeyHex);
            keypairInstance = Ed25519Keypair.fromSecretKey(decoded.secretKey);
        } catch (error) {
            // Method 2: Fallback - assume it's already in the right format
            console.warn('Failed to decode private key, trying direct conversion:', error);
            const privateKeyBytes = fromHEX(config.suiPrivateKeyHex);
            keypairInstance = Ed25519Keypair.fromSecretKey(privateKeyBytes);
        }
    }
    return keypairInstance;
}

// Type guard to check if an object change has objectType property
function hasObjectType(change: any): change is { type: string; objectType: string; objectId?: string } {
    return change && typeof change.objectType === 'string';
}

// Type guard to check if an object change is a created object with objectId
function isCreatedObjectWithId(change: any): change is { type: 'created'; objectType: string; objectId: string } {
    return change && change.type === 'created' && hasObjectType(change) && 'objectId' in change;
}

async function executeTransaction(
    txb: TransactionBlock,
    objectTypeSuffix: 'Schema' | 'Attestation'
): Promise<{ transactionDigest: string; createdObjectId: string | null }> {
    const client = getSuiClient();
    const keypair = getKeypair();

    console.log(`Executing transaction for ${objectTypeSuffix}... Signer: ${keypair.getPublicKey().toSuiAddress()}`);

    try {
        const result = await client.signAndExecuteTransactionBlock({
            signer: keypair,
            transactionBlock: txb,
            options: {
                showEffects: true,
                showObjectChanges: true,
                showEvents: true,
                showInput: true,
            },
        });

        console.log(`Transaction successful for ${objectTypeSuffix}. Digest: ${result.digest}`);
        console.log('Transaction effects:', JSON.stringify(result.effects, null, 2));
        console.log('Object changes:', JSON.stringify(result.objectChanges, null, 2));

        let createdObjectId: string | null = null;
        
        // Method 1: Check object changes first
        if (result.objectChanges) {
            const createdObject = result.objectChanges.find(
                (change: any) =>
                    isCreatedObjectWithId(change) && (
                        change.objectType.endsWith(`::${config.appModuleName}::${objectTypeSuffix}`) ||
                        change.objectType.includes(`::${objectTypeSuffix}`)
                    )
            );
            if (createdObject && isCreatedObjectWithId(createdObject)) {
                createdObjectId = createdObject.objectId;
                console.log(`Found created object ID from object changes: ${createdObjectId}`);
            }
        }

        // Method 2: Fallback to effects.created
        if (!createdObjectId && result.effects?.created?.[0]?.reference?.objectId) {
            console.warn(`Using fallback to find created object ID for ${objectTypeSuffix}`);
            createdObjectId = result.effects.created[0].reference.objectId;
            console.log(`Found created object ID from effects: ${createdObjectId}`);
        }

        if (!createdObjectId) {
            console.warn(`Could not determine created object ID for ${objectTypeSuffix} from transaction effects.`);
            console.log("Full transaction result:", JSON.stringify(result, null, 2));
        }

        return {
            transactionDigest: result.digest,
            createdObjectId: createdObjectId,
        };
    } catch (error: any) {
        console.error(`Error executing transaction for ${objectTypeSuffix} on Sui:`, error.message, error.stack);
        throw error;
    }
}

export async function createSchemaOnSui(
    name: string,
    description: string,
    definitionJson: string
): ReturnType<typeof executeTransaction> {
    console.log('Creating schema with params:', { 
        name, 
        description, 
        definitionJsonLength: definitionJson.length,
        movePackageId: config.movePackageId,
        appModuleName: config.appModuleName
    });

    const txb = new TransactionBlock();
    txb.moveCall({
        target: `${config.movePackageId}::${config.appModuleName}::create_schema`,
        arguments: [
            txb.pure(name, 'string'),
            txb.pure(description, 'string'),
            txb.pure(definitionJson, 'string'),
        ],
    });
    txb.setGasBudget(10_000_000);
    
    const result = await executeTransaction(txb, 'Schema');
    console.log('Schema creation final result:', result);
    
    return result;
}

export async function createAttestationOnSui(
    subjectAddress: string,
    dataHash: Uint8Array,
    schemaObjectId: string
): ReturnType<typeof executeTransaction> {
    const txb = new TransactionBlock();
    txb.moveCall({
        target: `${config.movePackageId}::${config.appModuleName}::create_attestation`,
        arguments: [
            txb.pure.address(subjectAddress || '0x0000000000000000000000000000000000000000000000000000000000000000'),
            txb.pure(Array.from(dataHash), 'vector<u8>'),
            txb.object(schemaObjectId),
        ],
    });
    txb.setGasBudget(15_000_000);
    return executeTransaction(txb, 'Attestation');
}

export async function getSuiObject(objectId: string): Promise<any> {
    const client = getSuiClient();
    try {
        console.log(`Fetching object: ${objectId}`);
        const objectResponse = await client.getObject({
            id: objectId,
            options: { 
                showContent: true, 
                showType: true, 
                showOwner: true, 
                showPreviousTransaction: true 
            },
        });
        
        if (objectResponse.error) {
            console.error(`Error fetching object ${objectId}:`, objectResponse.error);
            throw new Error(`Error fetching object ${objectId}: ${objectResponse.error.code}`);
        }
        if (!objectResponse.data) {
            console.error(`Object ${objectId} not found or no data.`);
            throw new Error(`Object ${objectId} not found or no data.`);
        }
        
        console.log(`Successfully fetched object ${objectId}:`, JSON.stringify(objectResponse.data, null, 2));
        return objectResponse.data;
    } catch (error) {
        console.error(`Error fetching object ${objectId} from Sui:`, error);
        throw error;
    }
}

// Helper function to process attestation objects
function processAttestationObject(obj: any): any {
    const content = obj.data?.content;
    const processed: any = {
        objectId: obj.data?.objectId,
        type: obj.data?.type,
        owner: obj.data?.owner,
        previousTransaction: obj.data?.previousTransaction,
        version: obj.data?.version,
        digest: obj.data?.digest,
    };

    // Extract Move object fields if available
    if (content?.dataType === 'moveObject' && content.fields) {
        Object.assign(processed, {
            subjectAddress: content.fields.subject_address,
            dataHash: content.fields.data_hash,
            schemaId: content.fields.schema_id,
            attestor: content.fields.attestor,
            timestamp: content.fields.timestamp,
        });
    }

    return processed;
}

// Helper function to process schema objects
function processSchemaObject(obj: any): any {
    const content = obj.data?.content;
    const processed: any = {
        objectId: obj.data?.objectId,
        type: obj.data?.type,
        owner: obj.data?.owner,
        previousTransaction: obj.data?.previousTransaction,
        version: obj.data?.version,
        digest: obj.data?.digest,
    };

    // Extract Move object fields if available
    if (content?.dataType === 'moveObject' && content.fields) {
        Object.assign(processed, {
            name: content.fields.name,
            description: content.fields.description,
            definitionJson: content.fields.definition_json,
            creator: content.fields.creator,
            timestamp: content.fields.timestamp,
        });
    }

    return processed;
}

export async function getAllAttestationsFromSui(
    limit: number = 50,
    cursor?: string
): Promise<{
    data: any[];
    hasNextPage: boolean;
    nextCursor: string | null;
}> {
    const client = getSuiClient();
    const attestationType = `${config.movePackageId}::${config.appModuleName}::Attestation`;
    
    console.log(`Fetching attestations with type: ${attestationType}`);
    
    try {
        // Use queryTransactionBlocks to find transactions that created attestations
        const queryOptions: any = {
            filter: {
                MoveFunction: {
                    package: config.movePackageId,
                    module: config.appModuleName,
                    function: 'create_attestation'
                }
            },
            options: {
                showEffects: true,
                showObjectChanges: true,
                showEvents: true,
            },
            limit: Math.min(limit * 2, 100), // Query more to account for potential filtering
            order: 'descending' as const,
        };

        if (cursor) {
            queryOptions.cursor = cursor;
        }

        console.log('Querying transactions with options:', JSON.stringify(queryOptions, null, 2));
        const response = await client.queryTransactionBlocks(queryOptions);
        console.log(`Found ${response.data.length} create_attestation transactions`);

        const attestations: any[] = [];
        const processedObjectIds = new Set<string>(); // Avoid duplicates
        
        for (const tx of response.data) {
            console.log(`Processing transaction: ${tx.digest}`);
            
            if (tx.objectChanges) {
                for (const change of tx.objectChanges) {
                    // Only check objectType if the change has this property
                    if (hasObjectType(change)) {
                        const isAttestationType = change.objectType === attestationType || 
                                               change.objectType.includes('::Attestation') ||
                                               change.objectType.endsWith('::Attestation');
                        
                        if (isCreatedObjectWithId(change) && 
                            isAttestationType &&
                            !processedObjectIds.has(change.objectId)) {
                            
                            processedObjectIds.add(change.objectId);
                            console.log(`Found created attestation object: ${change.objectId}`);
                            
                            try {
                                const objectData = await client.getObject({
                                    id: change.objectId,
                                    options: {
                                        showContent: true,
                                        showType: true,
                                        showOwner: true,
                                        showPreviousTransaction: true,
                                    }
                                });
                                
                                if (objectData.data) {
                                    const processed = processAttestationObject({ data: objectData.data });
                                    attestations.push(processed);
                                    console.log(`Successfully processed attestation: ${change.objectId}`);
                                }
                            } catch (objError) {
                                console.warn(`Failed to fetch attestation object ${change.objectId}:`, objError);
                            }
                        }
                    }
                }
            }

            // Also check effects.created as fallback
            if (tx.effects?.created) {
                for (const created of tx.effects.created) {
                    if (created.reference?.objectId && 
                        !processedObjectIds.has(created.reference.objectId)) {
                        
                        try {
                            const objectData = await client.getObject({
                                id: created.reference.objectId,
                                options: {
                                    showContent: true,
                                    showType: true,
                                    showOwner: true,
                                    showPreviousTransaction: true,
                                }
                            });
                            
                            if (objectData.data && 
                                (objectData.data.type === attestationType || 
                                 objectData.data.type?.includes('::Attestation'))) {
                                
                                processedObjectIds.add(created.reference.objectId);
                                const processed = processAttestationObject({ data: objectData.data });
                                attestations.push(processed);
                                console.log(`Successfully processed attestation from effects: ${created.reference.objectId}`);
                            }
                        } catch (objError) {
                            console.warn(`Failed to fetch attestation object from effects ${created.reference.objectId}:`, objError);
                        }
                    }
                }
            }
        }

        // Limit results and remove any remaining duplicates
        const uniqueAttestations = attestations
            .filter((attestation, index, self) => 
                index === self.findIndex(a => a.objectId === attestation.objectId)
            )
            .slice(0, limit);

        console.log(`Returning ${uniqueAttestations.length} unique attestations`);

        return {
            data: uniqueAttestations,
            hasNextPage: response.hasNextPage && uniqueAttestations.length === limit,
            nextCursor: response.nextCursor || null,
        };
        
    } catch (error) {
        console.error('Error fetching attestations from Sui:', error);
        throw new Error(`Failed to fetch attestations: ${error}`);
    }
}

export async function getAttestationsByOwner(
    ownerAddress: string,
    limit: number = 50,
    cursor?: string
): Promise<{
    data: any[];
    hasNextPage: boolean;
    nextCursor: string | null;
}> {
    const client = getSuiClient();
    const attestationType = `${config.movePackageId}::${config.appModuleName}::Attestation`;
    
    console.log(`Fetching attestations by owner: ${ownerAddress}`);
    
    try {
        const ownedObjectsOptions: any = {
            owner: ownerAddress,
            filter: {
                StructType: attestationType
            },
            options: {
                showContent: true,
                showType: true,
                showOwner: true,
                showPreviousTransaction: true,
            },
            limit,
        };

        if (cursor) {
            ownedObjectsOptions.cursor = cursor;
        }

        const response = await client.getOwnedObjects(ownedObjectsOptions);
        console.log(`Found ${response.data.length} owned attestation objects`);

        // Process each object with proper typing
        const attestations = response.data
            .filter(obj => obj.data) // Filter out any null data
            .map((obj: any) => processAttestationObject(obj));

        return {
            data: attestations,
            hasNextPage: response.hasNextPage,
            nextCursor: response.nextCursor || null,
        };
        
    } catch (error) {
        console.error('Error fetching attestations by owner from Sui:', error);
        throw new Error(`Failed to fetch attestations by owner: ${error}`);
    }
}

export async function getAllSchemasFromSui(
    limit: number = 50,
    cursor?: string
): Promise<{
    data: any[];
    hasNextPage: boolean;
    nextCursor: string | null;
}> {
    const client = getSuiClient();
    const schemaType = `${config.movePackageId}::${config.appModuleName}::Schema`;
    
    console.log(`Fetching schemas with type: ${schemaType}`);
    console.log(`Using package ID: ${config.movePackageId}, module: ${config.appModuleName}`);
    
    try {
        // Use queryTransactionBlocks to find transactions that created schemas
        const queryOptions: any = {
            filter: {
                MoveFunction: {
                    package: config.movePackageId,
                    module: config.appModuleName,
                    function: 'create_schema'
                }
            },
            options: {
                showEffects: true,
                showObjectChanges: true,
                showEvents: true,
            },
            limit: Math.min(limit * 2, 100), // Query more to account for potential filtering
            order: 'descending' as const,
        };

        if (cursor) {
            queryOptions.cursor = cursor;
        }

        console.log('Querying transactions with options:', JSON.stringify(queryOptions, null, 2));
        const response = await client.queryTransactionBlocks(queryOptions);
        console.log(`Found ${response.data.length} create_schema transactions`);

        const schemas: any[] = [];
        const processedObjectIds = new Set<string>(); // Avoid duplicates
        
        for (const tx of response.data) {
            console.log(`Processing transaction: ${tx.digest}`);
            
            // Log transaction details for debugging
            if (tx.objectChanges) {
                tx.objectChanges.forEach((change, index) => {
                    if (hasObjectType(change)) {
                        console.log(`  Change ${index}: type=${change.type}, objectType=${change.objectType}`);
                    } else {
                        console.log(`  Change ${index}: type=${change.type}, no objectType property`);
                    }
                });
            }
            
            if (tx.objectChanges) {
                for (const change of tx.objectChanges) {
                    // Only check objectType if the change has this property
                    if (hasObjectType(change)) {
                        // More flexible type checking
                        const isSchemaType = change.objectType === schemaType || 
                                           change.objectType.includes('::Schema') ||
                                           change.objectType.endsWith('::Schema');
                        
                        console.log(`  Checking change: type=${change.type}, isSchemaType=${isSchemaType}, objectType=${change.objectType}`);
                        
                        if (isCreatedObjectWithId(change) && 
                            isSchemaType &&
                            !processedObjectIds.has(change.objectId)) {
                            
                            processedObjectIds.add(change.objectId);
                            console.log(`Found created schema object: ${change.objectId}`);
                            
                            try {
                                const objectData = await client.getObject({
                                    id: change.objectId,
                                    options: {
                                        showContent: true,
                                        showType: true,
                                        showOwner: true,
                                        showPreviousTransaction: true,
                                    }
                                });
                                
                                if (objectData.data) {
                                    console.log(`Object data for ${change.objectId}:`, JSON.stringify(objectData.data, null, 2));
                                    const processed = processSchemaObject({ data: objectData.data });
                                    schemas.push(processed);
                                    console.log(`Successfully processed schema: ${change.objectId}`);
                                } else {
                                    console.warn(`No data found for schema object ${change.objectId}`);
                                }
                            } catch (objError) {
                                console.warn(`Failed to fetch schema object ${change.objectId}:`, objError);
                            }
                        }
                    }
                }
            }
            
            // Also check effects.created as fallback
            if (tx.effects?.created) {
                console.log(`  Checking ${tx.effects.created.length} created objects in effects`);
                for (const created of tx.effects.created) {
                    if (created.reference?.objectId && 
                        !processedObjectIds.has(created.reference.objectId)) {
                        
                        console.log(`  Checking created object from effects: ${created.reference.objectId}`);
                        
                        try {
                            const objectData = await client.getObject({
                                id: created.reference.objectId,
                                options: {
                                    showContent: true,
                                    showType: true,
                                    showOwner: true,
                                    showPreviousTransaction: true,
                                }
                            });
                            
                            console.log(`  Object type from effects: ${objectData.data?.type}`);
                            
                            if (objectData.data && 
                                (objectData.data.type === schemaType || 
                                 objectData.data.type?.includes('::Schema'))) {
                                
                                processedObjectIds.add(created.reference.objectId);
                                const processed = processSchemaObject({ data: objectData.data });
                                schemas.push(processed);
                                console.log(`Successfully processed schema from effects: ${created.reference.objectId}`);
                            }
                        } catch (objError) {
                            console.warn(`Failed to fetch schema object from effects ${created.reference.objectId}:`, objError);
                        }
                    }
                }
            }
        }

        // Remove duplicates and limit results
        const uniqueSchemas = schemas
            .filter((schema, index, self) => 
                index === self.findIndex(s => s.objectId === schema.objectId)
            )
            .slice(0, limit);

        console.log(`Returning ${uniqueSchemas.length} unique schemas out of ${schemas.length} total found`);

        return {
            data: uniqueSchemas,
            hasNextPage: response.hasNextPage && uniqueSchemas.length === limit,
            nextCursor: response.nextCursor || null,
        };
        
    } catch (error: any) {
        console.error('Error fetching schemas from Sui:', error);
        console.error('Error stack:', error.stack);
        throw new Error(`Failed to fetch schemas: ${error.message || error}`);
    }
}

// Alternative function with retry logic and different approach
export async function getAllSchemasWithRetry(
    limit: number = 50,
    cursor?: string,
    maxRetries: number = 3
): Promise<{
    data: any[];
    hasNextPage: boolean;
    nextCursor: string | null;
}> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Attempt ${attempt} to fetch schemas`);
            const result = await getAllSchemasFromSui(limit, cursor);
            
            console.log(`Attempt ${attempt} result: ${result.data.length} schemas found`);
            
            // If we found schemas or this is the last attempt, return the result
            if (result.data.length > 0 || attempt === maxRetries) {
                return result;
            }
            
            // If no data and not the last attempt, wait and retry
            if (attempt < maxRetries) {
                console.log(`No schemas found on attempt ${attempt}, retrying in 2 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
        } catch (error: any) {
            lastError = error;
            console.error(`Attempt ${attempt} failed:`, error.message);
            
            if (attempt < maxRetries) {
                console.log(`Retrying in 2 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
    
    throw lastError || new Error('All retry attempts failed');
}

// Alternative approach using direct object queries if you have known object IDs
export async function getSchemasByIds(objectIds: string[]): Promise<any[]> {
    const client = getSuiClient();
    const schemas: any[] = [];
    
    console.log(`Fetching schemas by IDs: ${objectIds.join(', ')}`);
    
    for (const objectId of objectIds) {
        try {
            const objectData = await client.getObject({
                id: objectId,
                options: {
                    showContent: true,
                    showType: true,
                    showOwner: true,
                    showPreviousTransaction: true,
                }
            });
            
            if (objectData.data) {
                const processed = processSchemaObject({ data: objectData.data });
                schemas.push(processed);
                console.log(`Successfully fetched schema: ${objectId}`);
            }
        } catch (error) {
            console.warn(`Failed to fetch schema ${objectId}:`, error);
        }
    }
    
    return schemas;
}

export async function getSchemasByOwner(
    ownerAddress: string,
    limit: number = 50,
    cursor?: string
): Promise<{
    data: any[];
    hasNextPage: boolean;
    nextCursor: string | null;
}> {
    const client = getSuiClient();
    const schemaType = `${config.movePackageId}::${config.appModuleName}::Schema`;
    
    console.log(`Fetching schemas by owner: ${ownerAddress}`);
    
    try {
        const ownedObjectsOptions: any = {
            owner: ownerAddress,
            filter: {
                StructType: schemaType
            },
            options: {
                showContent: true,
                showType: true,
                showOwner: true,
                showPreviousTransaction: true,
            },
            limit,
        };

        if (cursor) {
            ownedObjectsOptions.cursor = cursor;
        }

        const response = await client.getOwnedObjects(ownedObjectsOptions);
        console.log(`Found ${response.data.length} owned schema objects`);

        // Process each object with proper typing
        const schemas = response.data
            .filter(obj => obj.data) // Filter out any null data
            .map((obj: any) => processSchemaObject(obj));

        return {
            data: schemas,
            hasNextPage: response.hasNextPage,
            nextCursor: response.nextCursor || null,
        };
        
    } catch (error) {
        console.error('Error fetching schemas by owner from Sui:', error);
        throw new Error(`Failed to fetch schemas by owner: ${error}`);
    }
}