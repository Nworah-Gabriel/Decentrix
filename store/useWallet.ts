import { create } from "zustand";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

interface WalletStore {
  account: ReturnType<typeof useCurrentAccount> | null;
  sessionExpiry: Date | null;
  isConnected: boolean;

  // Methods
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshSession: () => Promise<void>;
  signAndExecuteTransaction: (transaction: Transaction) => Promise<any>;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  account: null,
  sessionExpiry: null,
  isConnected: false,

  connect: async () => {
    try {
      const currentAccount = useCurrentAccount();
      if (!currentAccount?.address) {
        throw new Error("Failed to connect wallet - no address returned");
      }

      // Set session expiry (30 minutes from now)
      const expiry = new Date(Date.now() + 30 * 60 * 1000);

      set({
        account: currentAccount,
        sessionExpiry: expiry,
        isConnected: true,
      });

      // Store session in localStorage
      localStorage.setItem(
        "suiSession",
        JSON.stringify({
          address: currentAccount.address,
          expiry: expiry.toISOString(),
        })
      );
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  },

  disconnect: async () => {
    localStorage.removeItem("suiSession");
    set({
      account: null,
      sessionExpiry: null,
      isConnected: false,
    });
  },

  refreshSession: async () => {
    try {
      const currentAccount = useCurrentAccount();
      if (!currentAccount?.address) return;

      // Extend session by 30 minutes
      const newExpiry = new Date(Date.now() + 30 * 60 * 1000);
      set({ sessionExpiry: newExpiry });

      localStorage.setItem(
        "suiSession",
        JSON.stringify({
          address: currentAccount.address,
          expiry: newExpiry.toISOString(),
        })
      );
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  },

  signAndExecuteTransaction: async (transaction: Transaction) => {
    try {
      const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
      const currentAccount = useCurrentAccount();

      if (!currentAccount?.address) {
        throw new Error("Wallet not connected");
      }

      // Execute transaction directly using dApp Kit
      const result = await signAndExecute({
        transaction,
      });

      return result;
    } catch (error) {
      console.error("Error executing transaction:", error);
      throw error;
    }
  },
}));
