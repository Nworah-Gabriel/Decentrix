import { create } from "zustand";
import { API_URL } from "@/constants";
import { useSchemaStore } from "@/store/useSchema";
import { Stats } from "@/types";

// Interfaces
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

export interface NewAttestationPayload {
  subjectAddress: string;
  dataToAttest: string;
  schemaObjectId: string;
}

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
  loading: boolean;
  error?: string | null;

  fetchAttestations: () => Promise<void>;
  fetchAttestationById: (id: string) => Promise<void>;
  createAttestation: (
    payload: NewAttestationPayload
  ) => Promise<NewAttestationResponse | undefined>;

  setAttestations: (data: Attestation[], totalSchemas: number) => void;
  setSelectedAttestation: (attestation: Attestation | null) => void;
  refreshStats: (totalSchemas: number) => void;
}

// Zustand Store
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
  loading: false,
  error: null,

  // Setters
  setAttestations: (data, totalSchemas) => {
    set({
      allAttestations: data,
      recentAttestations: data.slice(0, 8),
      attestations: data,
      stats: {
        totalAttestations: data.length,
        totalSchemas,
        uniqueAttestors: new Set(data.map((a) => a.creator)).size,
      },
    });
  },

  setSelectedAttestation: (attestation) => {
    set({ selectedAttestation: attestation });
  },

  refreshStats: (totalSchemas) => {
    const attestations = get().allAttestations;
    const uniqueAttestors = new Set(attestations.map((a) => a.creator)).size;

    set({
      stats: {
        totalAttestations: attestations.length,
        totalSchemas,
        uniqueAttestors,
      },
    });
  },

  // Fetch all
  fetchAttestations: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/attestations`);
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.json();
      const schemaStore = useSchemaStore.getState();
      get().setAttestations(data.data as Attestation[], schemaStore.schemas.length);
      set({ loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  // Fetch single
  fetchAttestationById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/attestations/${id}`);
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.json();
      set({ selectedAttestation: data.content as Attestation, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  // Create new
  createAttestation: async (payload: NewAttestationPayload) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/attestations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const result = await res.json();
      await get().fetchAttestations(); // Refresh after creation
      return result as NewAttestationResponse;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return undefined;
    }
  },
}));
