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
  ConnectButton,
  useDisconnectWallet,
} from "@mysten/dapp-kit";

export function WalletConnect() {
  const { connect, disconnect, sessionExpiry, isConnected } = useWalletStore();
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: disconnectWallet } = useDisconnectWallet();

  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [network, setNetwork] = useState<string>("Testnet");
  const [loading, setLoading] = useState(false);

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

      // Convert from MIST (smallest unit) to SUI
      const suiBalance = Number(balance.totalBalance) / 1_000_000_000;
      setBalance(`${suiBalance.toFixed(4)} SUI`);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("Error loading");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      disconnectWallet();
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  useEffect(() => {
    if (currentAccount?.address) {
      fetchBalance();
    }
  }, [currentAccount?.address]);

  // If no account connected, show connect button
  if (!currentAccount?.address) {
    return (
      <div className="flex gap-2">
        {/* Use dApp Kit's ConnectButton or custom button */}
        <ConnectButton
          connectText="Connect Wallet"
          className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200 border-2 p-3 rounded-sm"
        />
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
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Session Expires
              </span>
              <span className="text-sm font-medium">
                {sessionExpiry ? new Date(sessionExpiry).toLocaleString() : "-"}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href={`/address/${currentAccount.address}`}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View Profile
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/dashboard" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            My Dashboard
          </a>
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
