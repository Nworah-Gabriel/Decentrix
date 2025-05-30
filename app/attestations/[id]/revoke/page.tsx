import { RevokeAttestation } from "@/components/revoke-attestation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface RevokeAttestationPageProps {
  params: Promise<{ id: string }>;
}

export default async function RevokeAttestationPage({
  params,
}: RevokeAttestationPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/attestations/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Attestation
          </Button>
        </Link>
      </div>

      <RevokeAttestation attestationId={id} />
    </div>
  );
}
