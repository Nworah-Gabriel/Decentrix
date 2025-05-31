"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Copy, ExternalLink, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWalletStore } from "@/store/useWallet";
import {
  useCurrentAccount,
  useSuiClient,
  useConnectWallet,
  useDisconnectWallet,
  useWallets,
} from "@mysten/dapp-kit";
import {
  isEnokiWallet,
  type EnokiWallet,
  type AuthProvider,
} from "@mysten/enoki";
import Link from "next/link";

export function WalletConnect() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: connect } = useConnectWallet();
  const { mutate: disconnectWallet } = useDisconnectWallet();

  const { setWalletData, clearWalletData, setBalance } = useWalletStore();

  const [balance, setLocalBalance] = useState<string | undefined>(undefined);
  const [network, setNetwork] = useState<string>("Testnet");
  const [loading, setLoading] = useState(false);

  // Get Enoki wallets
  const wallets = useWallets().filter(isEnokiWallet);
  const walletsByProvider = wallets.reduce(
    (map, wallet) => map.set(wallet.provider, wallet),
    new Map<AuthProvider, EnokiWallet>()
  );
  const googleWallet = walletsByProvider.get("google");

  const copyAddress = () => {
    if (currentAccount?.address) {
      navigator.clipboard.writeText(currentAccount.address);
    }
  };

  const fetchBalance = async () => {
    if (!currentAccount?.address) return;

    try {
      setLoading(true);
      const balance = await suiClient.getBalance({
        owner: currentAccount.address,
      });

      const suiBalance = Number(balance.totalBalance) / 1_000_000_000;
      const balanceString = `${suiBalance.toFixed(4)} SUI`;

      setLocalBalance(balanceString);
      setBalance(balanceString);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setLocalBalance("Error loading");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    try {
      disconnectWallet();
      clearWalletData();
      setLocalBalance(undefined);
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  const handleGoogleConnect = () => {
    if (googleWallet) {
      connect({ wallet: googleWallet });
    }
  };

  useEffect(() => {
    if (currentAccount?.address) {
      setWalletData({
        address: currentAccount.address,
        publicKey: currentAccount.publicKey,
      });
      fetchBalance();
    } else {
      clearWalletData();
      setLocalBalance(undefined);
    }
  }, [currentAccount, setWalletData, clearWalletData]);

  if (!currentAccount?.address) {
    return (
      <div className="flex flex-col gap-4 items-center">
        {googleWallet ? (
          <Button
            onClick={handleGoogleConnect}
            className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600 border-2 px-6 py-3 rounded-md font-medium"
          >
            Connect wallet
          </Button>
        ) : (
          <div className="text-red-500">Wallet not available</div>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full" />
          <span className="font-mono text-sm">
            {currentAccount.address.slice(0, 6)}...
            {currentAccount.address.slice(-4)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-medium">Connected</div>
                <Badge variant="secondary" className="text-xs">
                  {network}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Address</span>
              <div className="flex items-center gap-1">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {currentAccount.address.slice(0, 8)}...
                  {currentAccount.address.slice(-6)}
                </code>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Balance</span>
              <span className="text-sm font-medium">
                {loading ? "Loading..." : balance || "0 SUI"}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={`/address/${currentAccount.address}`}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            My Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
