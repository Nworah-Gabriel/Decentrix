import { VerifyAttestation } from "@/components/verify-attestation";

export default function VerifyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Verify Attestation
          </h1>
          <p className="text-muted-foreground">
            Verify the authenticity and validity of an attestation.
          </p>
        </div>
      </div>

      <VerifyAttestation />
    </div>
  );
}
