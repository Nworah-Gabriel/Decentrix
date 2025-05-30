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
import { useAttestationStore } from "@/lib/store";

export default function CreateAttestationPage() {
  const router = useRouter();
  const { allSchemas } = useAttestationStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    schemaId: "",
    to: "",
    data: {} as Record<string, any>,
    expirationTime: "",
    revocable: true,
    refUID: "",
    value: "",
  });
  const [selectedSchema, setSelectedSchema] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSchemaSelect = (schemaId: string) => {
    const schema = allSchemas.find((s) => s.id === schemaId);
    setSelectedSchema(schema);
    setFormData({ ...formData, schemaId });

    // Initialize data object with schema fields
    if (schema) {
      const initialData: Record<string, any> = {};
      schema.fields.forEach((field) => {
        initialData[field] = "";
      });
      setFormData((prev) => ({ ...prev, data: initialData }));
    }
  };

  const updateDataField = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
    }));
  };

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.schemaId) newErrors.schema = "Please select a schema";
    }

    if (stepNumber === 2) {
      if (!formData.to) newErrors.to = "Recipient address is required";
      if (formData.to && !formData.to.startsWith("0x")) {
        newErrors.to = "Invalid Sui address format";
      }
    }

    if (stepNumber === 3) {
      if (selectedSchema) {
        selectedSchema.fields.forEach((field: string) => {
          if (!formData.data[field]) {
            newErrors[`data_${field}`] = `${field} is required`;
          }
        });
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real app, this would call the Sui blockchain
      console.log("Creating attestation:", formData);

      router.push("/attestations");
    } catch (error) {
      console.error("Error creating attestation:", error);
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
                    formData.schemaId === schema.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : "border-border hover:border-blue-300"
                  }`}
                  onClick={() => handleSchemaSelect(schema.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{schema.id}</Badge>
                      <h4 className="font-medium">{schema.name}</h4>
                    </div>
                    <Badge variant="secondary">
                      {schema.attestationCount} attestations
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {schema.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {schema.fields.slice(0, 4).map((field, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {field}
                      </Badge>
                    ))}
                    {schema.fields.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{schema.fields.length - 4} more
                      </Badge>
                    )}
                  </div>
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
              <Button onClick={handleNext} disabled={!formData.schemaId}>
                Continue to Recipient
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
              <h3 className="text-lg font-semibold mb-4">
                Recipient & Settings
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Specify who will receive this attestation and configure
                additional settings.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="to">Recipient Address *</Label>
                <Input
                  id="to"
                  placeholder="0x..."
                  value={formData.to}
                  onChange={(e) =>
                    setFormData({ ...formData, to: e.target.value })
                  }
                  className={errors.to ? "border-red-500" : ""}
                />
                {errors.to && (
                  <p className="text-sm text-red-500">{errors.to}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="refUID">Reference UID (Optional)</Label>
                <Input
                  id="refUID"
                  placeholder="0x... (reference to another attestation)"
                  value={formData.refUID}
                  onChange={(e) =>
                    setFormData({ ...formData, refUID: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Link this attestation to another existing attestation
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expirationTime">
                  Expiration Time (Optional)
                </Label>
                <Input
                  id="expirationTime"
                  type="datetime-local"
                  value={formData.expirationTime}
                  onChange={(e) =>
                    setFormData({ ...formData, expirationTime: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for permanent attestation
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Value (SUI)</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.000000001"
                  placeholder="0.0"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Optional SUI amount to send with the attestation
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="revocable"
                  checked={formData.revocable}
                  onChange={(e) =>
                    setFormData({ ...formData, revocable: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="revocable">
                  Make this attestation revocable
                </Label>
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
                Fill in the data fields according to the selected schema.
              </p>
            </div>

            {selectedSchema && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">#{selectedSchema.id}</Badge>
                    <CardTitle className="text-base">
                      {selectedSchema.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedSchema.fields.map((field: string, index: number) => (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)} *
                      </Label>
                      <Input
                        id={field}
                        placeholder={`Enter ${field}...`}
                        value={formData.data[field] || ""}
                        onChange={(e) => updateDataField(field, e.target.value)}
                        className={
                          errors[`data_${field}`] ? "border-red-500" : ""
                        }
                      />
                      {errors[`data_${field}`] && (
                        <p className="text-sm text-red-500">
                          {errors[`data_${field}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

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
                    <Badge variant="outline">#{formData.schemaId}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{selectedSchema?.name}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Recipient & Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recipient:</span>
                    <code className="text-sm">
                      {formData.to.slice(0, 8)}...{formData.to.slice(-6)}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revocable:</span>
                    <Badge
                      variant={formData.revocable ? "default" : "secondary"}
                    >
                      {formData.revocable ? "Yes" : "No"}
                    </Badge>
                  </div>
                  {formData.expirationTime && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires:</span>
                      <span>
                        {new Date(formData.expirationTime).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {formData.value && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Value:</span>
                      <span>{formData.value} SUI</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Attestation Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm bg-muted p-3 rounded overflow-x-auto">
                    {JSON.stringify(formData.data, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>

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
