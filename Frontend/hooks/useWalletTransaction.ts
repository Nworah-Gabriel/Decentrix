// hooks/useWalletOperations.ts
import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useWalletStore } from "@/store/useWallet";

export function useWalletOperations() {
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  const executeTransaction = async (transaction: Transaction) => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }

    try {
      const result = await signAndExecuteTransaction({
        transaction,
      });

      return result;
    } catch (err: any) {
      console.error("Transaction execution failed:", err);
      const errorMessage = err.message || "Transaction failed";
      throw new Error(errorMessage);
    }
  };

  const isWalletReady = () => {
    return !!currentAccount?.address;
  };

  return {
    executeTransaction,
    isWalletReady,
    currentAccount,
  };
}
