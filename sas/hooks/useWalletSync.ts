// hooks/useWalletSync.ts
import { useEffect, useRef, useCallback } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useWalletStore } from "@/store/useWallet";
import { isEnokiWallet, type AuthProvider } from "@mysten/enoki";

export function useWalletSync() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const {
    setWalletData,
    clearWalletData,
    setBalance,
    address: storedAddress,
    isConnected: storedIsConnected,
  } = useWalletStore();

  const previousAccountRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);
  const balanceFetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced balance fetcher to prevent excessive API calls
  const fetchBalance = useCallback(
    async (accountAddress: string) => {
      if (balanceFetchTimeoutRef.current) {
        clearTimeout(balanceFetchTimeoutRef.current);
      }

      balanceFetchTimeoutRef.current = setTimeout(async () => {
        try {
          const balanceData = await suiClient.getBalance({
            owner: accountAddress,
          });

          const suiBalance = Number(balanceData.totalBalance) / 1_000_000_000;
          const balanceString = `${suiBalance.toFixed(4)} SUI`;
          setBalance(balanceString);
        } catch (error) {
          console.error("Error fetching balance:", error);
          setBalance("Error loading");
        }
      }, 500); // 500ms debounce
    },
    [suiClient, setBalance]
  );

  // Main wallet sync effect - only runs when account actually changes
  useEffect(() => {
    const currentAddress = currentAccount?.address || null;
    const previousAddress = previousAccountRef.current;

    // Skip if this is the initial render and we have stored data
    if (!isInitializedRef.current && storedAddress && !currentAddress) {
      isInitializedRef.current = true;
      return;
    }

    // Only process if the address actually changed
    if (currentAddress === previousAddress) {
      return;
    }

    console.log(
      `Wallet address changed: ${previousAddress} → ${currentAddress}`
    );

    if (currentAddress) {
      // Wallet connected or account changed
      try {
        const walletData = {
          address: currentAddress,
          publicKey: currentAccount?.publicKey
            ? new Uint8Array(currentAccount.publicKey)
            : new Uint8Array(),
          walletProvider: "google" as AuthProvider, // Detect dynamically if needed
          network: "testnet",
        };

        setWalletData(walletData);

        // Fetch balance for new address
        fetchBalance(currentAddress);

        console.log("Wallet synced to store:", currentAddress);
      } catch (error) {
        console.error("Error syncing wallet data:", error);
      }
    }

    previousAccountRef.current = currentAddress;
    isInitializedRef.current = true;
  }, [
    currentAccount?.address,
    currentAccount?.publicKey,
    setWalletData,
    clearWalletData,
    fetchBalance,
    storedAddress,
  ]);

  // Separate effect for balance updates on existing connections
  useEffect(() => {
    if (currentAccount?.address && currentAccount.address === storedAddress) {
      // Only update balance if the address matches what we have stored
      fetchBalance(currentAccount.address);
    }
  }, [currentAccount?.address, storedAddress, fetchBalance]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (balanceFetchTimeoutRef.current) {
        clearTimeout(balanceFetchTimeoutRef.current);
      }
    };
  }, []);

  // Handle edge case where persisted data exists but no active connection
  useEffect(() => {
    // Only show this warning after initial load is complete
    if (isInitializedRef.current && storedAddress && !currentAccount?.address) {
      console.log(
        "Stored wallet data found but no active connection. User may need to reconnect."
      );
      // Don't automatically clear - let the user decide
    }
  }, [storedAddress, currentAccount?.address]);
}
