"use client";
import { useState, useEffect } from "react";
import type React from "react";

import { useAttestationStore } from "@/store/useAttestation";
import { useSchemaStore } from "@/store/useSchema";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { useWalletStore } from "@/store/useWallet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
}

const Provider: React.FC<Props> = ({ children }) => {
  const queryClient = new QueryClient();
  const { networkConfig } = createNetworkConfig({
    testnet: { url: getFullnodeUrl("testnet") },
    mainnet: { url: getFullnodeUrl("mainnet") },
  });

  const { fetchAttestations } = useAttestationStore();
  const { fetchSchemas } = useSchemaStore();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchAttestations(), fetchSchemas()]);
      } catch (error) {
        console.error("Error loading initial data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchAttestations, fetchSchemas]);

  useEffect(() => {
    const storedSession = localStorage.getItem("suiSession");
    if (storedSession) {
      const { address, expiry } = JSON.parse(storedSession);
      const expiryDate = new Date(expiry);

      if (expiryDate > new Date()) {
        useWalletStore.getState().connect();
      } else {
        localStorage.removeItem("suiSession");
      }
    }
  }, []);

  if (loading) {
    return <div>Loading data...</div>; // Replace with a skeleton/loader component if needed
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export default Provider;
