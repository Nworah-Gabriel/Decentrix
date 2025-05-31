// TYPES

export interface Schema {
  id: string;
  name: string;
  description: string;
  definition_json: string;
  creator?: string;
  issuer?: string;
  subject?: string;
  data_hash?: string[];
  schema_id?: string;
  timestamp_ms: string;
}

export interface NewSchemaPayload {
  name: string;
  description: string;
  definition_json: string;
}

export interface NewSchemaResponse {
  message: string;
  transactionDigest: string;
  attestationObjectId: string;
  suiObjectLink: string;
}

export interface Stats {
  totalAttestations: number;
  totalSchemas: number;
  uniqueAttestors: number;
}
