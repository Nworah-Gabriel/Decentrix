import { API_URL } from "@/constants";
import { Stats } from "@/types";
import { create } from "zustand";
import { useSchemaStore } from "./useSchema";

//Attestation
export interface Attestation {
  id: string;
  name: string;
  description: string;
  definition_json: string;
  creator: string;
  issuer: string;
  subject: string;
  data_hash: string[];
  schema_id: string;
  timestamp_ms: string;
}

// Response for multiple attestations
export interface AttestationsResponse {
  attestations: Attestation[];
  hasNextPage: boolean;
  nextCursor: string;
}

// Response for a single attestation
export interface AttestationResponse {
  version: string;
  digest: string;
  type: string;
  owner: any;
  previousTransaction: string;
  storageRebate: string;
  content: Attestation;
}

// Payload to create a new attestation
export interface NewAttestationPayload {
  subjectAddress: string;
  dataToAttest: string;
  schemaObjectId: string;
}

// Response after creating new attestation
export interface NewAttestationResponse {
  message: string;
  transactionDigest: string;
  attestationObjectId: string;
  suiObjectLink: string;
}

interface AttestationStore {
  stats: Stats;
  allAttestations: Attestation[];
  recentAttestations: Attestation[];
  attestations: Attestation[];
  selectedAttestation?: Attestation | null;

  fetchAttestations: () => Promise<void>;
  setAttestations: (data: Attestation[]) => void;

  fetchAttestationById: (id: string) => Promise<void>;
  setSelectedAttestation: (attestation: Attestation | null) => void;

  createAttestation: (
    payload: NewAttestationPayload
  ) => Promise<NewAttestationResponse | undefined>;

  refreshStats: () => void;
}

export const useAttestationStore = create<AttestationStore>((set, get) => ({
  stats: {
    totalAttestations: 0,
    totalSchemas: 0,
    uniqueAttestors: 0,
  },
  allAttestations: [],
  recentAttestations: [],
  attestations: [],
  selectedAttestation: null,

  setAttestations: (data) => {
    // Get total schemas count from schema store
    const totalSchemas = useSchemaStore.getState().allSchemas.length;

    set({
      allAttestations: data,
      recentAttestations: data.slice(0, 8),
      attestations: data,
      stats: {
        ...get().stats,
        totalAttestations: data.length,
        totalSchemas,
      },
    });
  },

  fetchAttestations: async () => {
    try {
      const response = await fetch(`${API_URL}/attestations`);
      if (!response.ok)
        throw new Error(`Failed to fetch attestations: ${response.statusText}`);

      const data: Attestation[] = await response.json();
      get().setAttestations(data);
    } catch (error) {
      console.error("Error fetching attestations:", error);
      // Clear attestations and reset stats on error
      set({
        allAttestations: [],
        recentAttestations: [],
        attestations: [],
        stats: { totalAttestations: 0, totalSchemas: 0, uniqueAttestors: 0 },
      });
    }
  },

  fetchAttestationById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/attestations/${id}`);
      if (!response.ok)
        throw new Error(`Failed to fetch attestation: ${response.statusText}`);

      const data: AttestationResponse = await response.json();
      get().setSelectedAttestation(data.content);
    } catch (error) {
      console.error("Error fetching attestation by id:", error);
      get().setSelectedAttestation(null);
    }
  },

  setSelectedAttestation: (attestation) => {
    set({ selectedAttestation: attestation });
  },

  createAttestation: async (payload: NewAttestationPayload) => {
    try {
      const response = await fetch(`${API_URL}/attestations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error(`Failed to create attestation: ${response.statusText}`);

      const data: NewAttestationResponse = await response.json();

      // Refresh attestations (and stats) after creation
      await get().fetchAttestations();

      return data;
    } catch (error) {
      console.error("Error creating attestation:", error);
      return undefined;
    }
  },

  refreshStats: () => {
    const totalSchemas = useSchemaStore.getState().allSchemas.length;
    const totalAttestations = get().allAttestations.length;

    set({
      stats: {
        ...get().stats,
        totalSchemas,
        totalAttestations,
      },
    });
  },
}));
