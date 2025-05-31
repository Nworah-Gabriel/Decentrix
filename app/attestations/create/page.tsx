"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Info } from "lucide-react";
import { useAttestationStore } from "@/store/useAttestation";
import { useSchemaStore } from "@/store/useSchema";
import { useWalletStore } from "@/store/useWallet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function CreateAttestationPage() {
  const router = useRouter();
  const { schemas, loading } = useSchemaStore();
  const { createAttestation } = useAttestationStore();
  const { isConnected } = useWalletStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    schemaObjectId: "",
    subjectAddress: "",
    dataToAttest: "",
  });

  const [selectedSchema, setSelectedSchema] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Set selected schema when user picks from dropdown
  const handleSchemaSelect = (schemaId: string) => {
    const schema = schemas.find((s) => s.id === schemaId);
    setSelectedSchema(schema ?? null);
    setFormData({ ...formData, schemaObjectId: schemaId });
  };

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {};
    if (stepNumber === 1 && !formData.schemaObjectId) {
      newErrors.schema = "Please select a schema.";
    }
    if (stepNumber === 2) {
      if (!formData.subjectAddress)
        newErrors.subjectAddress = "Subject address is required.";
      else if (!formData.subjectAddress.startsWith("0x"))
        newErrors.subjectAddress = "Invalid Sui address format.";
    }
    if (stepNumber === 3) {
      if (!formData.dataToAttest.trim())
        newErrors.dataToAttest = "Attestation data is required.";
      try {
        JSON.parse(formData.dataToAttest);
      } catch {
        newErrors.dataToAttest = "Data must be valid JSON.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setIsLoading(true);

    if (!isConnected) {
      setErrors({
        submit: "Wallet not connected. Please connect your wallet first.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await createAttestation(formData);
      if (result) {
        setSuccess(true);
        setSuccessMessage(
          `Attestation created successfully! Redirecting to attestations list...`
        );
        setTimeout(() => {
          router.push("/attestations");
        }, 2000); // 2 second delay
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      setErrors({ submit: "Failed to create attestation" });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Schema</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Choose the schema that defines the structure of your attestation
              data.
            </p>

            {loading ? (
              <p className="text-muted-foreground">Loading schemas...</p>
            ) : (
              <div className="space-y-2">
                <Label>Schema *</Label>
                <Select
                  onValueChange={handleSchemaSelect}
                  value={formData.schemaObjectId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a schema" />
                  </SelectTrigger>
                  <SelectContent>
                    {schemas.map((schema) => (
                      <SelectItem key={schema.id} value={schema.id}>
                        {schema.name || "Untitled Schema"} –{" "}
                        <span className="text-muted-foreground text-xs">
                          {schema.id.slice(0, 6)}...{schema.id.slice(-4)}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.schema && (
                  <p className="text-sm text-red-500">{errors.schema}</p>
                )}
              </div>
            )}
          </div>

          <Button onClick={handleNext} disabled={!formData.schemaObjectId}>
            Continue to Subject
          </Button>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-6">
          <Label htmlFor="subjectAddress">Subject Address *</Label>
          <Input
            id="subjectAddress"
            placeholder="0x..."
            value={formData.subjectAddress}
            onChange={(e) =>
              setFormData({ ...formData, subjectAddress: e.target.value })
            }
            className={errors.subjectAddress ? "border-red-500" : ""}
          />
          {errors.subjectAddress && (
            <p className="text-sm text-red-500">{errors.subjectAddress}</p>
          )}
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={handleNext}>Continue to Data</Button>
          </div>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="space-y-6">
          <Label htmlFor="dataToAttest">Attestation Data *</Label>
          <textarea
            id="dataToAttest"
            className={`w-full h-48 p-3 border rounded-md bg-background font-mono text-sm ${
              errors.dataToAttest ? "border-red-500" : ""
            }`}
            placeholder='{"name": "John Doe", "verified": true}'
            value={formData.dataToAttest}
            onChange={(e) =>
              setFormData({ ...formData, dataToAttest: e.target.value })
            }
          />
          {errors.dataToAttest && (
            <p className="text-sm text-red-500">{errors.dataToAttest}</p>
          )}
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={() => setStep(4)}>Review & Create</Button>
          </div>
        </div>
      );
    }

    if (step === 4) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Attestation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Schema:</span>
                <Badge variant="outline">
                  {formData.schemaObjectId.slice(0, 6)}...
                  {formData.schemaObjectId.slice(-4)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span>{selectedSchema?.name || "Untitled"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subject:</span>
                <code>{formData.subjectAddress}</code>
              </div>
              <div>
                <Label>Data:</Label>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {JSON.stringify(JSON.parse(formData.dataToAttest), null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>

          {errors.submit && (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This action will post a transaction to the Sui blockchain.
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Attestation"}
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  if (success) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert className="flex items-center gap-2 mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/attestations">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Attestations
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Create Attestation</h1>
          <p className="text-muted-foreground">
            Generate a new on-chain attestation
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 flex items-center justify-center rounded-full font-medium text-sm ${
                step === s
                  ? "bg-blue-500 text-white"
                  : s < step
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">{renderStepContent()}</CardContent>
      </Card>
    </div>
  );
}
