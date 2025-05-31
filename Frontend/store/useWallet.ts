import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Transaction } from "@mysten/sui/transactions";
import { EnokiWallet, type AuthProvider } from "@mysten/enoki";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";

interface WalletStore {
  address: string | null;
  publicKey: string | Uint8Array | null;
  sessionExpiry: Date | null;
  isConnected: boolean;
  balance: string | null;
  currentAccount: EnokiWallet | null;
  walletProvider: AuthProvider | null;
  network: string;

  // Methods
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setWalletData: (data: {
    address: string;
    publicKey: string | Uint8Array;
    walletProvider: AuthProvider;
    network: string;
    sessionExpiry?: Date;
    currentAccount?: EnokiWallet;
  }) => void;
  clearWalletData: () => void;
  setBalance: (balance: string) => void;
  refreshSession: () => void;
  executeTransaction: (transaction: Transaction) => Promise<any>;
  updateConnectionStatus: (isConnected: boolean) => void;
}

// Custom serialization to handle Uint8Array and complex objects
const customStorage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;

    try {
      const parsed = JSON.parse(str);

      // Convert publicKey back to Uint8Array if it exists and is an array
      if (parsed.state?.publicKey && Array.isArray(parsed.state.publicKey)) {
        parsed.state.publicKey = new Uint8Array(parsed.state.publicKey);
      }

      // Convert sessionExpiry back to Date if it exists
      if (parsed.state?.sessionExpiry) {
        parsed.state.sessionExpiry = new Date(parsed.state.sessionExpiry);
      }

      return parsed;
    } catch {
      return null;
    }
  },

  setItem: (name: string, value: any) => {
    try {
      const toStore = { ...value };

      // Convert Uint8Array to regular array for JSON serialization
      if (
        toStore.state?.publicKey &&
        toStore.state.publicKey instanceof Uint8Array
      ) {
        toStore.state.publicKey = Array.from(toStore.state.publicKey);
      }

      localStorage.setItem(name, JSON.stringify(toStore));
    } catch (error) {
      console.error("Failed to save wallet data to storage:", error);
    }
  },

  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => {
      const init = {
        address: null,
        publicKey: null,
        sessionExpiry: null,
        isConnected: false,
        balance: null,
        currentAccount: null,
        walletProvider: null,
        network: "Testnet",
      };

      const executeTransaction = async (transaction: Transaction) => {
        const currentAccount = get().currentAccount;
        if (!currentAccount) {
          throw new Error("Wallet not connected");
        }

        try {
          // Get the first account from the wallet
          const accounts = currentAccount.accounts;
          const firstAccount = accounts[0];

          if (!firstAccount) {
            throw new Error("No account found in wallet");
          }

          // Use dapp-kit's signAndExecuteTransaction
          const { mutateAsync: signAndExecute } =
            useSignAndExecuteTransaction();
          const result = await signAndExecute({
            transaction,
          });
          return result;
        } catch (err: any) {
          const errorMessage = err.message || "Transaction failed";
          throw new Error(errorMessage);
        }
      };

      const connect = async () => {
        // This will be handled by the dapp-kit ConnectButton
        throw new Error("Use ConnectButton component instead");
      };

      const disconnect = async () => {
        set(init);
      };

      const setWalletData = (data: {
        address: string;
        publicKey: string | Uint8Array;
        walletProvider: AuthProvider;
        network: string;
        sessionExpiry?: Date;
        currentAccount?: EnokiWallet;
      }) => {
        set({
          address: data.address,
          publicKey: data.publicKey,
          sessionExpiry: data.sessionExpiry || new Date(Date.now() + 3600000),
          isConnected: true,
          currentAccount: data.currentAccount || get().currentAccount,
          walletProvider: data.walletProvider,
          network: data.network,
        });
      };

      const clearWalletData = () => {
        set(init);
      };

      const refreshSession = () => {
        const account = get().currentAccount;
        if (account) {
          set({
            address: account.accounts[0]?.address,
            publicKey: account.accounts[0]?.publicKey,
            sessionExpiry: new Date(Date.now() + 3600000),
            isConnected: true,
            currentAccount: account,
            walletProvider: get().walletProvider,
            network: get().network,
          });
        }
      };

      const setBalance = (balance: string) => set({ balance });

      const updateConnectionStatus = (isConnected: boolean) => {
        set({ isConnected });
      };

      return {
        ...init,
        connect,
        disconnect,
        setWalletData,
        clearWalletData,
        setBalance,
        refreshSession,
        executeTransaction,
        updateConnectionStatus,
      };
    },
    {
      name: "wallet-storage", // Storage key
      storage: createJSONStorage(() => customStorage),

      // Partition to only persist certain fields
      partialize: (state) => ({
        address: state.address,
        publicKey: state.publicKey,
        sessionExpiry: state.sessionExpiry,
        isConnected: state.isConnected,
        balance: state.balance,
        walletProvider: state.walletProvider,
        network: state.network,
        // Note: currentAccount is excluded as it may contain non-serializable data
      }),

      // Rehydration function to validate session on app startup
      onRehydrateStorage: () => (state) => {
        if (
          state?.sessionExpiry &&
          new Date() > new Date(state.sessionExpiry)
        ) {
          // Session expired, clear wallet data
          state.clearWalletData();
          console.log("Wallet session expired, cleared data");
        }
      },
    }
  )
);
