"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAttestationStore } from "@/store/useAttestation";
import Link from "next/link";

interface RevokeAttestationProps {
  attestationId: string;
}

export function RevokeAttestation({ attestationId }: RevokeAttestationProps) {
  const router = useRouter();
  const { selectedAttestation, fetchAttestationById } = useAttestationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAttestation = async () => {
      setLoading(true);
      await fetchAttestationById(attestationId);
      setLoading(false);
    };

    loadAttestation();
  }, [attestationId, fetchAttestationById]);

  const handleRevoke = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call for revoking attestation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real implementation, this would call the revoke API
      console.log("Revoking attestation:", attestationId);

      router.push(`/attestations/${attestationId}`);
    } catch (err) {
      setError("Failed to revoke attestation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">
            Loading attestation...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!selectedAttestation) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Attestation not found</p>
          <p className="text-sm text-muted-foreground mt-2">
            The requested attestation could not be found.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/attestations/${attestationId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Attestation
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-red-600">
          Revoke Attestation
        </h1>
        <p className="text-muted-foreground">
          This action cannot be undone. Please review carefully before
          proceeding.
        </p>
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Warning:</strong> Revoking this attestation will permanently
          invalidate it. This action cannot be reversed.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Attestation Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Attestation ID
              </label>
              <p className="font-mono text-sm mt-1">
                {formatAddress(selectedAttestation.id)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Name
              </label>
              <p className="text-sm mt-1">{selectedAttestation.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Creator
              </label>
              <p className="font-mono text-sm mt-1">
                {formatAddress(selectedAttestation.creator)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Subject
              </label>
              <p className="font-mono text-sm mt-1">
                {formatAddress(selectedAttestation.subject)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Schema
              </label>
              <Badge variant="outline" className="mt-1">
                {formatAddress(selectedAttestation.schema_id)}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <Badge variant="default" className="mt-1">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Confirm Revocation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            By clicking "Revoke Attestation" below, you confirm that you want to
            permanently revoke this attestation. This will:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Mark the attestation as revoked on the blockchain</li>
            <li>Make it invalid for any future verification</li>
            <li>Record the revocation timestamp permanently</li>
            <li>Require gas fees for the transaction</li>
          </ul>

          <div className="flex items-center gap-4 pt-4">
            <Button
              variant="destructive"
              onClick={handleRevoke}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Revoking..." : "Revoke Attestation"}
            </Button>
            <Link href={`/attestations/${attestationId}`}>
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
