"use client";

import { useState } from "react";
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

interface WalletState {
  connected: boolean;
  address?: string;
  balance?: string;
  network?: string;
}

export function WalletConnect() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
  });

  const connectWallet = async () => {
    // Simulate wallet connection
    setWallet({
      connected: true,
      address: "0x1234567890abcdef1234567890abcdef12345678",
      balance: "1,234.56 SUI",
      network: "Mainnet",
    });
  };

  const disconnectWallet = () => {
    setWallet({ connected: false });
  };

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
    }
  };

  if (!wallet.connected) {
    return (
      <Button
        onClick={connectWallet}
        className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200 border-2"
      >
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full" />
          <span className="font-mono text-sm">
            {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
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
                  {wallet.network}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Address</span>
              <div className="flex items-center gap-1">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {wallet.address?.slice(0, 8)}...{wallet.address?.slice(-6)}
                </code>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Balance</span>
              <span className="text-sm font-medium">{wallet.balance}</span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href={`/address/${wallet.address}`}
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
        <DropdownMenuItem onClick={disconnectWallet} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
