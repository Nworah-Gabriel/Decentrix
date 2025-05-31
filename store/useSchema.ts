import { create } from "zustand";
import { Transaction } from "@mysten/sui/transactions";
import { API_URL } from "@/constants";
import { NewSchemaPayload, NewSchemaResponse, Schema } from "@/types";
import { useWalletStore } from "@/store/useWallet";

// Using Schema type from @/types

interface SchemaStore {
  schemas: Schema[];
  loading: boolean;
  error: string | null;

  fetchSchemas: () => Promise<void>;
  createSchema: (payload: NewSchemaPayload) => Promise<NewSchemaResponse>;

}

export const useSchemaStore = create<SchemaStore>((set, get) => {
  const walletStore = useWalletStore();

  const createSchema = async (payload: NewSchemaPayload) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(`${API_URL}/schemas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: payload.name,
          description: payload.description,
          definition_json: payload.definition_json
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create schema');
      }

      const result = await response.json();
      await get().fetchSchemas();
      set({ loading: false });
      return result;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw new Error('Failed to create schema: ' + error.message);
    }
  };

  return {
    schemas: [],
    loading: false,
    error: null,
    fetchSchemas: async () => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`${API_URL}/schemas`);
        if (!response.ok) {
          throw new Error(`Failed to fetch schemas: ${response.statusText}`);
        }
        const data = await response.json();
        set({ schemas: data.schemas });
      } catch (error: any) {
        set({ error: error.message });
      } finally {
        set({ loading: false });
      }
    },
    createSchema: async (payload: NewSchemaPayload) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`${API_URL}/schemas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: payload.name,
            description: payload.description,
            definition_json: payload.definition_json
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to create schema: ${response.statusText}`);
        }

        const result = await response.json();
        await get().fetchSchemas();
        return result;
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      } finally {
        set({ loading: false });
      }
    },
  };
});
