import { create } from "zustand";
import { Transaction } from "@mysten/sui/transactions";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";

interface WalletStore {
  address: string | null;
  readonly publicKey: any;
  sessionExpiry: Date | null;
  isConnected: boolean;
  balance: string | null;

  // Methods
  setWalletData: (data: {
    address: string;
    readonly publicKey?: any;
    sessionExpiry?: Date;
  }) => void;
  clearWalletData: () => void;
  setBalance: (balance: string) => void;
  refreshSession: () => void;
  executeTransaction: (transaction: Transaction) => Promise<any>;
}

export const useWalletStore = create<WalletStore>((set, get) => {
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  const executeTransaction = async (transaction: Transaction) => {
    if (!currentAccount?.address) {
      throw new Error("Wallet not connected");
    }

    try {
      const result = await signAndExecute({
        transaction,
      });

      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Transaction failed';
      throw new Error(errorMessage);
    }
  };

  return {
    address: null,
    publicKey: null,
    sessionExpiry: null,
    isConnected: false,
    balance: null,
    setWalletData: (data: {
      address: string;
      readonly publicKey?: any;
      sessionExpiry?: Date;
    }) => {
      const expiry = data.sessionExpiry || new Date(Date.now() + 30 * 60 * 1000);

      set({
        address: data.address,
        publicKey: data.publicKey || null,
        sessionExpiry: expiry,
        isConnected: true,
      });

      // Store session in localStorage
      localStorage.setItem(
        "suiSession",
        JSON.stringify({
          address: data.address,
          publicKey: data.publicKey,
          expiry: expiry.toISOString(),
        })
      );
    },
    clearWalletData: () => {
      localStorage.removeItem("suiSession");
      set({
        address: null,
        publicKey: null,
        sessionExpiry: null,
        isConnected: false,
        balance: null,
      });
    },
    setBalance: (balance: string) => {
      set({ balance });
    },
    refreshSession: () => {
      const { address } = get();
      if (!address) return;

      const newExpiry = new Date(Date.now() + 30 * 60 * 1000);
      set({ sessionExpiry: newExpiry });

      localStorage.setItem(
        "suiSession",
        JSON.stringify({
          address,
          expiry: newExpiry.toISOString(),
        })
      );
    },
    executeTransaction
  };
});
