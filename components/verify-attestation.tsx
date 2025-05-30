"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  Shield,
  Search,
  AlertTriangle,
} from "lucide-react";
import { useAttestationStore } from "@/lib/store";

export function VerifyAttestation() {
  const { getAttestationById } = useAttestationStore();
  const [uid, setUid] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleVerify = async () => {
    if (!uid.trim()) return;

    setIsLoading(true);

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const attestation = getAttestationById(uid);

    if (attestation) {
      setVerificationResult({
        found: true,
        valid: !attestation.revoked,
        attestation,
        checks: {
          exists: true,
          signature: true,
          schema: true,
          notRevoked: !attestation.revoked,
          notExpired: true,
        },
      });
    } else {
      setVerificationResult({
        found: false,
        valid: false,
        checks: {
          exists: false,
          signature: false,
          schema: false,
          notRevoked: false,
          notExpired: false,
        },
      });
    }

    setIsLoading(false);
  };

  const renderVerificationResult = () => {
    if (!verificationResult) return null;

    const { found, valid, attestation, checks } = verificationResult;

    return (
      <Card className={`mt-6 ${valid ? "border-green-200" : "border-red-200"}`}>
        <CardHeader>
          <CardTitle
            className={`flex items-center gap-2 ${
              valid ? "text-green-600" : "text-red-600"
            }`}
          >
            {valid ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            {valid ? "Verification Successful" : "Verification Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {found && attestation && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    UID
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
                    Attester
                  </Label>
                  <div className="mt-1">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {attestation.from.slice(0, 8)}...
                      {attestation.from.slice(-6)}
                    </code>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Recipient
                  </Label>
                  <div className="mt-1">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {attestation.to.slice(0, 8)}...{attestation.to.slice(-6)}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="font-medium">Verification Checks</h4>
            <div className="space-y-2">
              {Object.entries(checks).map(([check, passed]) => (
                <div key={check} className="flex items-center gap-2">
                  {passed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm capitalize">
                    {check.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {!found && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No attestation found with the provided UID. Please check the UID
                and try again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Verify Attestation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="uid">Attestation UID</Label>
            <div className="flex gap-2">
              <Input
                id="uid"
                placeholder="0x..."
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleVerify}
                disabled={!uid.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isLoading ? (
                  "Verifying..."
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Verify
                  </>
                )}
              </Button>
            </div>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Enter an attestation UID to verify its authenticity, validity, and
              current status on the Sui blockchain.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {renderVerificationResult()}
    </div>
  );
}
