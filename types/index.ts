// TYPES

export interface Schema {
  id: string;
  name: string;
  description: string;
  schema: string;
  creator: string;
  resolver: string | null;
  revocable: boolean;
  attestationCount: number;
  createdAt: string;
  fields: string[];
}

export interface Stats {
  totalAttestations: number;
  totalSchemas: number;
  uniqueAttestors: number;
}
