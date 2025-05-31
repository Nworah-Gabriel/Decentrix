import { useEffect } from "react";
import { isEnokiNetwork, registerEnokiWallets } from "@mysten/enoki";
import { useSuiClientContext } from "@mysten/dapp-kit";
import { SuiClient } from "@mysten/sui/client";
import { REDIRECT_URL } from "@/constants";

export default function RegisterEnokiWallets() {
  const { client, network } = useSuiClientContext();

  const enokiClient = new SuiClient({
    url:
      network === "testnet"
        ? "https://fullnode.testnet.sui.io:443"
        : "https://fullnode.devnet.sui.io:443",
  });

  useEffect(() => {
    if (!isEnokiNetwork(network)) return;

    // Always register Enoki wallets for testnet
    const { unregister } = registerEnokiWallets({
      apiKey: process.env.NEXT_ENOKI_API_KEY as string,
      providers: {
        google: {
          clientId: process.env.NEXT_GOOGLE_CLIENT_ID as string,
          redirectUrl: REDIRECT_URL as string,
        },
      },
      client: enokiClient,
      network,
    });

    return unregister;
  }, [client, network]);

  return null;
}
