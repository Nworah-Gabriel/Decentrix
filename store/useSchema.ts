import { API_URL } from "@/constants";
import { create } from "zustand";

// --- Types and Interfaces ---

export interface Schema {
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

export interface NewSchemaPayload {
  name: string;
  description: string;
  definitionJson: string;
}

export interface NewSchemaResponse {
  message: string;
  transactionDigest: string;
  attestationObjectId: string;
  suiObjectLink: string;
}

interface SchemaStore {
  schemas: Schema[];
  recentSchemas: Schema[];
  selectedSchema?: Schema | null;
  loading: boolean;
  error?: string | null;

  fetchSchemas: () => Promise<void>;
  fetchSchemaById: (id: string) => Promise<void>;
  createSchema: (
    payload: NewSchemaPayload
  ) => Promise<NewSchemaResponse | undefined>;

  setSelectedSchema: (schema: Schema | null) => void;
}

export const useSchemaStore = create<SchemaStore>((set, get) => ({
  schemas: [],
  recentSchemas: [],
  selectedSchema: null,
  loading: false,
  error: null,

  fetchSchemas: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/schemas`);
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.json();
      set({
        schemas: data.schemas,
        recentSchemas: data.schemas.slice(0, 6),
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchSchemaById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/schemas/${id}`);
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.json();
      set({ selectedSchema: data.content, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  createSchema: async (payload: NewSchemaPayload) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/schemas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const result = await res.json();
      // Refresh list after creation
      await get().fetchSchemas();
      return result as NewSchemaResponse;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return undefined;
    }
  },

  setSelectedSchema: (schema: Schema | null) => {
    set({ selectedSchema: schema });
  },
}));
