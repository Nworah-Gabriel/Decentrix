import dotenv from 'dotenv';
dotenv.config();

export const config = {
    suiRpcUrl: process.env.SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443',
    suiPrivateKeyHex: process.env.SUI_PRIVATE_KEY_HEX,
    movePackageId: process.env.MOVE_PACKAGE_ID,
    appModuleName: process.env.APP_MODULE_NAME || 'attestation_service_module',
    port: process.env.PORT || 3001,
    isTestnet: (process.env.SUI_RPC_URL || '').includes('testnet'),
    mongodbUri: process.env.MONGODB_URI,
};

if (!config.suiPrivateKeyHex) {
    throw new Error("SUI_PRIVATE_KEY_HEX environment variable is not set.");
}
if (!config.movePackageId) {
    throw new Error("MOVE_PACKAGE_ID environment variable is not set.");
}
if (!config.mongodbUri) {
    throw new Error("MONGODB_URI environment variable is not set.");
}