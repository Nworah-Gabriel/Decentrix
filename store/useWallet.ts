import { create } from "zustand";
import { Transaction } from "@mysten/sui/transactions";

interface WalletStore {
  address: string | null;
  publicKey: any;
  sessionExpiry: Date | null;
  isConnected: boolean;
  balance: string | null;
  currentAccount: any | null;

  // Methods
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setWalletData: (data: {
    address: string;
    publicKey?: any;
    sessionExpiry?: Date;
  }) => void;
  clearWalletData: () => void;
  setBalance: (balance: string) => void;
  refreshSession: () => void;
  executeTransaction: (transaction: Transaction) => Promise<any>;
}

export const useWalletStore = create<WalletStore>((set, get) => {
  const init = {
    address: null,
    publicKey: null,
    sessionExpiry: null,
    isConnected: false,
    balance: null,
    currentAccount: null,
  };

  const executeTransaction = async (transaction: Transaction) => {
    const currentAccount = get().currentAccount;
    if (!currentAccount?.address) {
      throw new Error("Wallet not connected");
    }

    try {
      const result = await currentAccount.signAndExecute({
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
    publicKey?: any;
    sessionExpiry?: Date;
  }) => {
    set({
      address: data.address,
      publicKey: data.publicKey,
      sessionExpiry: data.sessionExpiry || new Date(Date.now() + 3600000),
      isConnected: true,
      currentAccount: {
        address: data.address,
        publicKey: data.publicKey,
      },
    });
  };

  const clearWalletData = () => {
    set(init);
  };

  const refreshSession = () => {
    const account = get().currentAccount;
    if (account) {
      set({
        address: account.address,
        publicKey: account.publicKey,
        sessionExpiry: new Date(Date.now() + 3600000),
        isConnected: true,
        currentAccount: account,
      });
    }
  };

  const setBalance = (balance: string) => set({ balance });

  return {
    ...init,
    connect,
    disconnect,
    setWalletData,
    clearWalletData,
    setBalance,
    refreshSession,
    executeTransaction,
  };
});
