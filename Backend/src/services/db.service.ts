import { Schema, ISchema } from '../models/schema.model';
import { Attestation, IAttestation } from '../models/attestation.model';
import { config } from '../config';

interface PaginationOptions {
    page?: number;
    limit?: number;
}

export const dbService = {
    // Schema methods
    async createSchema(data: Omit<ISchema, 'networkType'>): Promise<ISchema> {
        const schema = new Schema({
            ...data,
            networkType: config.isTestnet ? 'testnet' : 'mainnet'
        });
        return await schema.save();
    },

    async getSchemaById(objectId: string): Promise<ISchema | null> {
        return await Schema.findOne({ objectId });
    },

    async getAllSchemas(options: PaginationOptions = {}): Promise<{
        schemas: ISchema[];
        total: number;
    }> {
        const limit = options.limit || 10;
        const skip = ((options.page || 1) - 1) * limit;

        const [schemas, total] = await Promise.all([
            Schema.find()
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit),
            Schema.countDocuments()
        ]);

        return { schemas, total };
    },

    // Attestation methods
    async createAttestation(data: Omit<IAttestation, 'networkType'>): Promise<IAttestation> {
        const attestation = new Attestation({
            ...data,
            networkType: config.isTestnet ? 'testnet' : 'mainnet'
        });
        return await attestation.save();
    },

    async getAttestationById(objectId: string): Promise<IAttestation | null> {
        return await Attestation.findOne({ objectId });
    },

    async getAllAttestations(options: PaginationOptions = {}): Promise<{
        attestations: IAttestation[];
        total: number;
    }> {
        const limit = options.limit || 10;
        const skip = ((options.page || 1) - 1) * limit;

        const [attestations, total] = await Promise.all([
            Attestation.find()
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit),
            Attestation.countDocuments()
        ]);

        return { attestations, total };
    },

    async getAttestationsBySchema(schemaId: string, options: PaginationOptions = {}): Promise<{
        attestations: IAttestation[];
        total: number;
    }> {
        const limit = options.limit || 10;
        const skip = ((options.page || 1) - 1) * limit;

        const [attestations, total] = await Promise.all([
            Attestation.find({ schemaId })
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit),
            Attestation.countDocuments({ schemaId })
        ]);

        return { attestations, total };
    }
};