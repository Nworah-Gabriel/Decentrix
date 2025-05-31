import mongoose from 'mongoose';

export interface IAttestation {
    objectId: string;
    schemaId: string;
    subjectAddress?: string;
    dataHash: string;
    attestor: string;
    timestamp: Date;
    transactionDigest: string;
    networkType: 'testnet' | 'mainnet';
}

const attestationSchema = new mongoose.Schema<IAttestation>({
    objectId: { type: String, required: true, unique: true },
    schemaId: { type: String, required: true },
    subjectAddress: { type: String },
    dataHash: { type: String, required: true },
    attestor: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    transactionDigest: { type: String, required: true },
    networkType: { type: String, required: true, enum: ['testnet', 'mainnet'] }
}, {
    timestamps: true,
    collection: 'attestations'
});

// Index for efficient queries
attestationSchema.index({ schemaId: 1 });
attestationSchema.index({ subjectAddress: 1 });
attestationSchema.index({ attestor: 1 });

export const Attestation = mongoose.model<IAttestation>('Attestation', attestationSchema);