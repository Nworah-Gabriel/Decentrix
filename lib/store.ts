import { create } from "zustand";

export interface Attestation {
  uid: string;
  schemaId: string;
  from: string; // attester
  to: string; // recipient
  type: "WITNESSED" | "SELF";
  age: string;
  time: string;
  revoked: boolean;
  data?: any;
}

export interface Schema {
  id: string;
  name: string;
  description: string;
  schema: string; // the actual schema definition
  creator: string; // creator address
  resolver: string | null; // resolver contract address
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

interface AttestationStore {
  stats: Stats;
  recentAttestations: Attestation[];
  recentSchemas: Schema[];
  allAttestations: Attestation[];
  allSchemas: Schema[];
  attestations: Attestation[]; // alias for allAttestations
  schemas: Schema[]; // alias for allSchemas
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

  const times = [
    "2024-01-15 14:30:25",
    "2024-01-14 09:15:42",
    "2024-01-13 16:45:18",
    "2024-01-08 11:22:35",
    "2024-01-01 08:17:29",
  ];

  return Array.from({ length: count }, (_, i) => ({
    uid: `0x${Math.random().toString(16).substr(2, 64)}`, // longer UID like real attestations
    schemaId: (Math.floor(Math.random() * 216) + 1).toString(),
    from: `0x${Math.random().toString(16).substr(2, 40)}`,
    to: `0x${Math.random().toString(16).substr(2, 40)}`,
    type: types[Math.floor(Math.random() * types.length)],
    age: ages[Math.floor(Math.random() * ages.length)],
    time: times[Math.floor(Math.random() * times.length)],
    revoked: Math.random() < 0.1, // 10% chance of being revoked
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

  const schemaDefinitions = [
    "string name, uint256 score, bool verified",
    "string fullName, string institution, string degree, uint256 year",
    "string skill, uint256 level, address issuer, uint256 timestamp",
    "uint256 rating, string category, bytes32 evidence",
    "string organization, string role, bool active, uint256 expiry",
    "string achievement, string description, uint256 points",
    "string[] skills, uint256[] levels, address[] validators",
    "string company, string position, uint256 startDate, uint256 endDate",
    "uint256 trustScore, address[] endorsers, string[] comments",
    "string standard, bool compliant, uint256 auditDate, address auditor",
  ];

  return Array.from({ length: count }, (_, i) => {
    const hasResolver = Math.random() > 0.6; // 40% have resolvers

    return {
      id: (i + 1).toString(),
      name: schemaNames[i % schemaNames.length],
      description: `A schema for ${schemaNames[
        i % schemaNames.length
      ].toLowerCase()} on the Sui blockchain.`,
      schema: schemaDefinitions[i % schemaDefinitions.length],
      creator: `0x${Math.random().toString(16).substr(2, 40)}`,
      resolver: hasResolver
        ? `0x${Math.random().toString(16).substr(2, 40)}`
        : null,
      revocable: Math.random() > 0.3, // 70% are revocable
      attestationCount: Math.floor(Math.random() * 1000) + 10,
      createdAt: `${Math.floor(Math.random() * 30) + 1} days ago`,
      fields: Array.from(
        { length: Math.floor(Math.random() * 5) + 3 },
        () => fieldOptions[Math.floor(Math.random() * fieldOptions.length)]
      ).filter((field, index, arr) => arr.indexOf(field) === index),
    };
  });
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
    attestations: allAttestations, // alias for component compatibility
    schemas: allSchemas, // alias for component compatibility
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
