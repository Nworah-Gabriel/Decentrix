import crypto from 'crypto';

export function sha256Hash(data: string): Uint8Array {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return new Uint8Array(hash.digest());
}