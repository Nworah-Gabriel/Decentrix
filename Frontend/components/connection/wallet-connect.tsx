"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Copy, LogOut, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWalletStore } from "@/store/useWallet";
import { useWalletSync } from "@/hooks/useWalletSync";
import {
  useCurrentAccount,
  useConnectWallet,
  useDisconnectWallet,
  useWallets,
  useSuiClient,
} from "@mysten/dapp-kit";
import {
  isEnokiWallet,
  type EnokiWallet,
  type AuthProvider,
} from "@mysten/enoki";

export function WalletConnect() {
  // Use the sync hook to keep store and dapp-kit in sync
  useWalletSync();

  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: connect } = useConnectWallet();
  const { mutate: disconnectWallet } = useDisconnectWallet();

  // Get data from Zustand store (which is now synced)
  const { balance, network, refreshSession, setBalance, clearWalletData } =
    useWalletStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const refreshBalance = async () => {
    if (!currentAccount?.address) return;

    setIsRefreshing(true);
    try {
      const balanceData = await suiClient.getBalance({
        owner: currentAccount.address,
      });

      const suiBalance = Number(balanceData.totalBalance) / 1_000_000_000;
      const balanceString = `${suiBalance.toFixed(4)} SUI`;
      setBalance(balanceString);
      refreshSession(); // Update session timestamp
    } catch (error) {
      console.error("Error refreshing balance:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDisconnect = () => {
    try {
      disconnectWallet();
      clearWalletData();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  const handleGoogleConnect = () => {
    if (googleWallet) {
      connect({ wallet: googleWallet });
    }
  };

  // Show connect button if no wallet is connected
  if (!currentAccount?.address) {
    return (
      <div className="flex flex-col gap-4 items-center">
        {googleWallet ? (
          <Button
            onClick={handleGoogleConnect}
            className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600 border-2 px-6 py-3 rounded-md font-medium"
          >
            Connect Wallet
          </Button>
        ) : (
          <div className="text-red-500">Google Wallet not available</div>
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
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">
                  {balance || "0 SUI"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshBalance}
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
