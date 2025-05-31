import { EnokiClient } from "@mysten/enoki";
import { toBase64 } from "@mysten/sui/utils";
import {
  useSignTransaction,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

const enokiClient = new EnokiClient({
  apiKey: process.env.NEXT_ENOKI_PRIVATE_KEY as string,
});

export function SponsoredTxExecutor({ tx }: { tx: Transaction }) {
  const suiClient = useSuiClient();
  const { mutateAsync: signTransaction } = useSignTransaction();
  const account = useCurrentAccount();

  const handleSponsoredTx = async () => {
    if (!account?.address) {
      alert("Wallet not connected.");
      return;
    }

    // 1. Build transaction bytes
    const txBytes = await tx.build({
      client: suiClient,
      onlyTransactionKind: true,
    });

    // 2. Request sponsorship
    const sponsored = await enokiClient.createSponsoredTransaction({
      network: "testnet",
      transactionKindBytes: toBase64(txBytes),
      sender: account.address,
      allowedMoveCallTargets: ["0x2::kiosk::set_owner_custom"],
      allowedAddresses: [account.address],
    });

    // 3. Sign with user's zkLogin key
    const { signature } = await signTransaction({
      transaction: sponsored.bytes,
    });
    if (!signature) {
      throw new Error("Error signing transaction");
    }

    // 4. Execute the transaction
    await enokiClient.executeSponsoredTransaction({
      digest: sponsored.digest,
      signature,
    });

    alert("Transaction successfully sent!");
  };

  return <button onClick={handleSponsoredTx}></button>;
}
