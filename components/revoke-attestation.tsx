"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, X } from "lucide-react";
import { useAttestationStore } from "@/lib/store";
import { useRouter } from "next/navigation";

interface RevokeAttestationProps {
  attestationId: string;
}

export function RevokeAttestation({ attestationId }: RevokeAttestationProps) {
  const router = useRouter();
  const { getAttestationById } = useAttestationStore();
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const attestation = getAttestationById(attestationId);

  if (!attestation) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Attestation not found</p>
        </CardContent>
      </Card>
    );
  }

  if (attestation.revoked) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Already Revoked</h3>
          <p className="text-muted-foreground">
            This attestation has already been revoked.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleRevoke = async () => {
    if (confirmText !== "REVOKE") return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);

    // In real app, update the store or refetch data
    router.push(`/attestations/${attestationId}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Revoke Attestation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> Revoking an attestation is permanent and
              cannot be undone. This action will mark the attestation as
              invalid.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Attestation UID
              </Label>
              <div className="mt-1">
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {attestation.uid}
                </code>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Schema
              </Label>
              <div className="mt-1">
                <Badge variant="outline">#{attestation.schemaId}</Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Current Status
              </Label>
              <div className="mt-1">
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revocation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Revocation (Optional)</Label>
            <textarea
              id="reason"
              className="w-full h-24 p-2 border rounded-md bg-background"
              placeholder="Explain why you're revoking this attestation..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">
              Type <strong>REVOKE</strong> to confirm
            </Label>
            <Input
              id="confirm"
              placeholder="REVOKE"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleRevoke}
              disabled={confirmText !== "REVOKE" || isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Revoking..." : "Revoke Attestation"}
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
