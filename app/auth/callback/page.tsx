"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/store/useWallet";
import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const walletStore = useWalletStore();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  useEffect(() => {
    // Handle the callback from zkLogin
    const handleCallback = async () => {
      try {
        // Attempt to connect the wallet
        await walletStore.connect();

        // Redirect to the home page after successful connection
        router.push("/");
      } catch (error) {
        console.error("Auth callback error:", error);
        // Redirect to error page or show error message
        router.push("/error");
      }
    };

    handleCallback();
  }, [router, walletStore.connect, signAndExecute, currentAccount]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Connecting your wallet...
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please wait while we connect your wallet.
        </p>
      </div>
    </div>
  );
}
