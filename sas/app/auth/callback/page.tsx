"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/store/useWallet";
import {
  useConnectWallet,
  useDisconnectWallet,
  useWallets,
} from "@mysten/dapp-kit";
import { Loader2 } from "lucide-react";
import { isEnokiWallet, type EnokiWallet, type AuthProvider } from "@mysten/enoki";

export default function AuthCallbackPage() {
  const router = useRouter();
  const walletStore = useWalletStore();
  const { mutateAsync: connectWallet } = useConnectWallet();
  const { mutateAsync: disconnect } = useDisconnectWallet();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the OAuth code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (!code) {
          throw new Error('No OAuth code found');
        }

        // Find the Google Enoki wallet
        const wallets = useWallets().filter(isEnokiWallet);
        const walletsByProvider = wallets.reduce(
          (map, wallet) => map.set(wallet.provider, wallet),
          new Map<AuthProvider, EnokiWallet>()
        );
        const googleWallet = walletsByProvider.get('google');
        
        if (!googleWallet) {
          throw new Error('Google wallet not found');
        }

        // Connect the wallet
        const result = await connectWallet({ wallet: googleWallet });
        const account = googleWallet.accounts[0];

        if (!account) {
          throw new Error('No account found in wallet');
        }

        // Set wallet data in store
        walletStore.setWalletData({
          address: account.address,
          publicKey: account.publicKey,
          walletProvider: 'google',
          network: 'Testnet'
        });

        // Redirect to home page
        router.push("/");
      } catch (error) {
        console.error("Auth callback error:", error);
        // Clear any partial wallet state
        await disconnect();
        walletStore.clearWalletData();
        router.push("/error");
      }
    };

    handleCallback();
  }, [router, connectWallet, disconnect, walletStore]);

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
