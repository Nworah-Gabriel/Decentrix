"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Plus, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAttestationStore } from "@/store/useAttestation";
import { useSchemaStore } from "@/store/useSchema";

export default function CreateAttestationPage() {
  const router = useRouter();
  const { allSchemas } = useSchemaStore();
  const { createAttestation } = useAttestationStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    schemaObjectId: "",
    subjectAddress: "",
    dataToAttest: "",
  });
  const [selectedSchema, setSelectedSchema] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSchemaSelect = (schemaId: string) => {
    const schema = allSchemas.find((s) => s.id === schemaId);
    setSelectedSchema(schema);
    setFormData({ ...formData, schemaObjectId: schemaId });
  };

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.schemaObjectId) newErrors.schema = "Please select a schema";
    }

    if (stepNumber === 2) {
      if (!formData.subjectAddress)
        newErrors.subjectAddress = "Subject address is required";
      if (
        formData.subjectAddress &&
        !formData.subjectAddress.startsWith("0x")
      ) {
        newErrors.subjectAddress = "Invalid Sui address format";
      }
    }

    if (stepNumber === 3) {
      if (!formData.dataToAttest.trim()) {
        newErrors.dataToAttest = "Attestation data is required";
      }
      try {
        JSON.parse(formData.dataToAttest);
      } catch {
        newErrors.dataToAttest = "Data must be valid JSON";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsLoading(true);

    try {
      const result = await createAttestation({
        schemaObjectId: formData.schemaObjectId,
        subjectAddress: formData.subjectAddress,
        dataToAttest: formData.dataToAttest,
      });

      if (result) {
        router.push("/attestations");
      } else {
        setErrors({ submit: "Failed to create attestation" });
      }
    } catch (error) {
      console.error("Error creating attestation:", error);
      setErrors({ submit: "Failed to create attestation" });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Schema</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Choose the schema that defines the structure of your attestation
                data.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
              {allSchemas.slice(0, 10).map((schema) => (
                <div
                  key={schema.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.schemaObjectId === schema.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : "border-border hover:border-blue-300"
                  }`}
                  onClick={() => handleSchemaSelect(schema.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {schema.id.slice(0, 8)}...{schema.id.slice(-6)}
                      </Badge>
                      <h4 className="font-medium">{schema.name}</h4>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {schema.description}
                  </p>
                </div>
              ))}
            </div>

            {errors.schema && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>{errors.schema}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center gap-2">
              <Button onClick={handleNext} disabled={!formData.schemaObjectId}>
                Continue to Subject
              </Button>
              <Link href="/schemas/create">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Schema
                </Button>
              </Link>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Subject Address</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Specify the subject address for this attestation.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
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
                  <p className="text-sm text-red-500">
                    {errors.subjectAddress}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  The Sui address that this attestation is about
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => setStep(1)} variant="outline">
                Back
              </Button>
              <Button onClick={handleNext}>Continue to Data</Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Attestation Data</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Provide the data to be attested in JSON format.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dataToAttest">Data to Attest *</Label>
                <textarea
                  id="dataToAttest"
                  className={`w-full h-48 p-3 border rounded-md bg-background font-mono text-sm ${
                    errors.dataToAttest ? "border-red-500" : ""
                  }`}
                  placeholder='{"name": "John Doe", "verified": true, "score": 95}'
                  value={formData.dataToAttest}
                  onChange={(e) =>
                    setFormData({ ...formData, dataToAttest: e.target.value })
                  }
                />
                {errors.dataToAttest && (
                  <p className="text-sm text-red-500">{errors.dataToAttest}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Enter valid JSON data that conforms to the selected schema
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => setStep(2)} variant="outline">
                Back
              </Button>
              <Button onClick={() => setStep(4)}>Review & Create</Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review & Confirm</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Please review all details before creating the attestation.
              </p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Schema Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Schema:</span>
                    <Badge variant="outline">
                      {formData.schemaObjectId.slice(0, 8)}...
                      {formData.schemaObjectId.slice(-6)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{selectedSchema?.name}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Subject & Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subject:</span>
                    <code className="text-sm">
                      {formData.subjectAddress.slice(0, 8)}...
                      {formData.subjectAddress.slice(-6)}
                    </code>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Attestation Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm bg-muted p-3 rounded overflow-x-auto">
                    {JSON.stringify(JSON.parse(formData.dataToAttest), null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>

            {errors.submit && (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Creating this attestation will require a transaction on the Sui
                blockchain. Make sure you have sufficient SUI for gas fees.
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-2">
              <Button onClick={() => setStep(3)} variant="outline">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isLoading ? "Creating..." : "Create Attestation"}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create Attestation
          </h1>
          <p className="text-muted-foreground">
            Create a new attestation on the Sui blockchain
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stepNumber === step
                  ? "bg-blue-500 text-white"
                  : stepNumber < step
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {stepNumber}
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
