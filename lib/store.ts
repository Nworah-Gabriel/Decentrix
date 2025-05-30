import { create } from "zustand";

export interface Attestation {
  uid: string;
  schemaId: string;
  from: string;
  to: string;
  type: "WITNESSED" | "SELF";
  age: string;
  data?: any;
}

export interface Schema {
  id: string;
  name: string;
  description: string;
  attestationCount: number;
  createdAt: string;
  fields: string[];
}

export interface Stats {
  totalAttestations: number;
  totalSchemas: number;
  uniqueAttestors: number;
}

interface AttestationStore {
  stats: Stats;
  recentAttestations: Attestation[];
  recentSchemas: Schema[];
  allAttestations: Attestation[];
  allSchemas: Schema[];
  getAttestationById: (id: string) => Attestation | undefined;
  getSchemaById: (id: string) => Schema | undefined;
}

// Mock data generator
const generateMockAttestations = (count: number): Attestation[] => {
  const types: ("WITNESSED" | "SELF")[] = ["WITNESSED", "SELF"];
  const ages = [
    "4 hours ago",
    "1 day ago",
    "2 days ago",
    "1 week ago",
    "2 weeks ago",
  ];

  return Array.from({ length: count }, (_, i) => ({
    uid: `0x${Math.random().toString(16).substr(2, 40)}`,
    schemaId: (Math.floor(Math.random() * 300) + 1).toString(),
    from: `0x${Math.random().toString(16).substr(2, 40)}`,
    to: `0x${Math.random().toString(16).substr(2, 40)}`,
    type: types[Math.floor(Math.random() * types.length)],
    age: ages[Math.floor(Math.random() * ages.length)],
  }));
};

const generateMockSchemas = (count: number): Schema[] => {
  const schemaNames = [
    "Identity Verification",
    "Educational Credential",
    "Professional Certification",
    "Reputation Score",
    "Membership Proof",
    "Achievement Badge",
    "Skill Verification",
    "Experience Record",
    "Trust Rating",
    "Compliance Certificate",
  ];

  const fieldOptions = [
    "name",
    "email",
    "score",
    "verified",
    "timestamp",
    "issuer",
    "level",
    "category",
    "description",
    "metadata",
    "expiry",
    "type",
    "status",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: (i + 1).toString(),
    name: schemaNames[i % schemaNames.length],
    description: `A schema for ${schemaNames[
      i % schemaNames.length
    ].toLowerCase()} on the Sui blockchain.`,
    attestationCount: Math.floor(Math.random() * 1000) + 10,
    createdAt: `${Math.floor(Math.random() * 30) + 1} days ago`,
    fields: Array.from(
      { length: Math.floor(Math.random() * 5) + 3 },
      () => fieldOptions[Math.floor(Math.random() * fieldOptions.length)]
    ).filter((field, index, arr) => arr.indexOf(field) === index),
  }));
};

// Generate mock data once to ensure consistency between server and client
const mockAttestations = generateMockAttestations(1000);
const mockSchemas = generateMockSchemas(216);

export const useAttestationStore = create<AttestationStore>((set, get) => {
  const allAttestations = mockAttestations;
  const allSchemas = mockSchemas;

  return {
    stats: {
      totalAttestations: 10768,
      totalSchemas: 216,
      uniqueAttestors: 634,
    },
    recentAttestations: allAttestations.slice(0, 8),
    recentSchemas: allSchemas.slice(0, 6),
    allAttestations,
    allSchemas,
    getAttestationById: (id: string) => {
      return get().allAttestations.find(
        (attestation) => attestation.uid === id
      );
    },
    getSchemaById: (id: string) => {
      return get().allSchemas.find((schema) => schema.id === id);
    },
  };
});
