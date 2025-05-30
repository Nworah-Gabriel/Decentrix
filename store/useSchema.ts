import { API_URL } from "@/constants";
import { create } from "zustand";

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

// Response for multiple schemas
export interface SchemasResponse {
  schemas: Schema[];
  hasNextPage: boolean;
  nextCursor: string;
}

// Response for single schema
export interface SchemaResponse {
  version: string;
  digest: string;
  type: string;
  owner: any;
  previousTransaction: string;
  storageRebate: string;
  content: Schema;
}

// Payload to create a new schema
export interface NewSchemaPayload {
  name: string;
  description: string;
  definitionJson: string;
}

// Response after creating a new schema
export interface NewSchemaResponse {
  message: string;
  transactionDigest: string;
  attestationObjectId: string;
  suiObjectLink: string;
}

interface SchemaStore {
  allSchemas: Schema[];
  recentSchemas: Schema[];
  schemas: Schema[]; // could be same as allSchemas, you might remove duplicates here
  selectedSchema?: Schema | null;

  fetchSchemas: () => Promise<void>;
  setSchemas: (data: Schema[]) => void;

  fetchSchemaById: (id: string) => Promise<void>;
  setSelectedSchema: (schema: Schema | null) => void;

  createSchema: (
    payload: NewSchemaPayload
  ) => Promise<NewSchemaResponse | undefined>;
}

export const useSchemaStore = create<SchemaStore>((set, get) => ({
  allSchemas: [],
  recentSchemas: [],
  schemas: [],
  selectedSchema: null,

  setSchemas: (data) => {
    set({
      allSchemas: data,
      recentSchemas: data.slice(0, 6),
      schemas: data,
    });
  },

  fetchSchemas: async () => {
    try {
      const response = await fetch(`${API_URL}/schemas`);
      if (!response.ok)
        throw new Error(`Failed to fetch schemas: ${response.statusText}`);

      const data: Schema[] = await response.json();
      get().setSchemas(data);
    } catch (error) {
      console.error("Error fetching schemas:", error);
      // optionally set empty or error state here
    }
  },

  fetchSchemaById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/schemas/${id}`);
      if (!response.ok)
        throw new Error(`Failed to fetch schema: ${response.statusText}`);

      const data: SchemaResponse = await response.json();
      // Assuming you want to save the `content` part (Schema)
      get().setSelectedSchema(data.content);
    } catch (error) {
      console.error("Error fetching schema by id:", error);
      get().setSelectedSchema(null);
    }
  },

  setSelectedSchema: (schema) => {
    set({ selectedSchema: schema });
  },

  createSchema: async (payload: NewSchemaPayload) => {
    try {
      const response = await fetch(`${API_URL}/schemas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error(`Failed to create schema: ${response.statusText}`);

      const data: NewSchemaResponse = await response.json();

      // Optionally fetch schemas again or update store accordingly
      await get().fetchSchemas();

      return data;
    } catch (error) {
      console.error("Error creating schema:", error);
      return undefined;
    }
  },
}));
