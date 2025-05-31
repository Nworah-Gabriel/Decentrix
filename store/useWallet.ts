import { create } from "zustand";
import { Transaction } from "@mysten/sui/transactions";
import { EnokiWallet, type AuthProvider } from "@mysten/enoki";
import { useWallets, useSignAndExecuteTransaction } from "@mysten/dapp-kit";

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
      const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
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
  }) => {
    const { currentAccount } = get();
    if (!currentAccount?.accounts?.[0]) {
      throw new Error("No account found in wallet");
    }

    console.log("curent account", currentAccount);

    set({
      address: data.address,
      publicKey: data.publicKey,
      sessionExpiry: data.sessionExpiry || new Date(Date.now() + 3600000),
      isConnected: true,
      currentAccount,
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
