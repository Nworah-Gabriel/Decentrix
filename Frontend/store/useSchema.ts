import { create } from "zustand";
import { API_URL } from "@/constants";
import { NewSchemaPayload, NewSchemaResponse, Schema } from "@/types";

// Using Schema type from @/types

interface SchemaStore {
  schemas: Schema[];
  loading: boolean;
  error: string | null;
  selectedSchema?: Schema | null;
  recentSchemas: Schema[];

  fetchSchemas: () => Promise<void>;
  fetchSchemaById: (id: string) => Promise<void>;
  createSchema: (payload: NewSchemaPayload) => Promise<NewSchemaResponse>;
}

export const useSchemaStore = create<SchemaStore>((set, get) => {
  const createSchema = async (payload: NewSchemaPayload) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/schemas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: payload.name,
          description: payload.description,
          definitionJson: payload.definitionJson
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create schema");
      }

      const result = await response.json();
      await get().fetchSchemas();
      set({ loading: false });
      return result;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw new Error("Failed to create schema: " + error.message);
    }
  };

  const fetchSchemaById = async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/schemas/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch schema");
      }
      const result = await response.json();
      set({ selectedSchema: result.content, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  };

  const fetchSchemas = async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/schemas`);
      if (!response.ok) {
        throw new Error("Failed to fetch schemas");
      }
      const result = await response.json();
      const content = Array.isArray(result.content) ? result.content : [];
      set({
        schemas: content,
        loading: false,
        recentSchemas: content.slice(0, 8),
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  };

  return {
    schemas: [],
    loading: false,
    error: null,
    selectedSchema: null,
    recentSchemas: [],
    fetchSchemas,
    fetchSchemaById,
    createSchema,
  };
});
