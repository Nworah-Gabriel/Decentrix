import { useEffect } from "react";
import { useSuiClientContext } from "@mysten/dapp-kit";
import { isEnokiNetwork, registerEnokiWallets } from "@mysten/enoki";

export default function RegisterEnokiWallets() {
  const { client, network } = useSuiClientContext();

  useEffect(() => {
    if (!isEnokiNetwork(network)) return;
    const { unregister } = registerEnokiWallets({
      apiKey: process.env.NEXT_ENOKI_API_KEY as string,
      providers: {
        google: { clientId: process.env.NEXT_GOOGLE_CLIENT_ID as string },
        facebook: { clientId: "YOUR_FACEBOOK_CLIENT_ID" },
      },
      client,
      network,
    });

    return unregister;
  }, [client, network]);

  return null;
}
