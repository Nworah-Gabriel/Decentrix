import mongoose from 'mongoose';

export interface ISchema {
    objectId: string;
    name: string;
    description: string;
    definitionJson: string;
    creator: string;
    timestamp: Date;
    transactionDigest: string;
    networkType: 'testnet' | 'mainnet';
}

const schemaSchema = new mongoose.Schema<ISchema>({
    objectId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    definitionJson: { type: String, required: true },
    creator: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    transactionDigest: { type: String, required: true },
    networkType: { type: String, required: true, enum: ['testnet', 'mainnet'] }
}, {
    timestamps: true,
    collection: 'schemas'
});

export const Schema = mongoose.model<ISchema>('Schema', schemaSchema);