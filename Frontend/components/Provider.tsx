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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@mysten/dapp-kit/dist/index.css";
import RegisterEnokiWallets from "./connection/RegisterEnokiWallet";
import LoadingSpinner from "./ui/LoadingSpinner";

interface Props {
  children: React.ReactNode;
}

const Provider: React.FC<Props> = ({ children }) => {
  const queryClient = new QueryClient();
  const { networkConfig } = createNetworkConfig({
    testnet: { url: getFullnodeUrl("testnet") },
    devnet: { url: getFullnodeUrl("devnet") },
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

  if (loading)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect={true}>
          <RegisterEnokiWallets />
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export default Provider;
