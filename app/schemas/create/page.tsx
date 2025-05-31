"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Info } from "lucide-react";
import { useSchemaStore } from "@/store/useSchema";
import { useWalletStore } from "@/store/useWallet";
import { useWalletOperations } from "@/hooks/useWalletTransaction";

const schemaTemplates: Record<string, object> = {
  email: {
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
    },
    required: ["email"],
  },
  kyc: {
    type: "object",
    properties: {
      name: { type: "string" },
      idNumber: { type: "string" },
      verified: { type: "boolean" },
      issuedBy: { type: "string" },
      issueDate: { type: "string", format: "date" },
    },
    required: ["name", "idNumber", "verified", "issuedBy", "issueDate"],
  },
  dob: {
    type: "object",
    properties: {
      dateOfBirth: { type: "string", format: "date" },
      placeOfBirth: { type: "string" },
    },
    required: ["dateOfBirth"],
  },
  phone: {
    type: "object",
    properties: {
      phoneNumber: { type: "string" },
      countryCode: { type: "string", minLength: 1, maxLength: 5 },
    },
    required: ["phoneNumber"],
  },
  passport: {
    type: "object",
    properties: {
      passportNumber: { type: "string" },
      country: { type: "string" },
      expiryDate: { type: "string", format: "date" },
    },
    required: ["passportNumber", "country", "expiryDate"],
  },
  covidVaccination: {
    type: "object",
    properties: {
      vaccineType: { type: "string" },
      doses: { type: "integer", minimum: 1 },
      vaccinationDate: { type: "string", format: "date" },
      verifiedBy: { type: "string" },
    },
    required: ["vaccineType", "doses", "vaccinationDate", "verifiedBy"],
  },
  residencyProof: {
    type: "object",
    properties: {
      address: { type: "string" },
      city: { type: "string" },
      country: { type: "string" },
      proofType: { type: "string" },
      issueDate: { type: "string", format: "date" },
    },
    required: ["address", "city", "country", "proofType", "issueDate"],
  },
  educationCredential: {
    type: "object",
    properties: {
      institutionName: { type: "string" },
      degree: { type: "string" },
      graduationYear: { type: "integer" },
      gpa: { type: "number", minimum: 0, maximum: 4 },
    },
    required: ["institutionName", "degree", "graduationYear"],
  },
};

export default function CreateSchemaPage() {
  const router = useRouter();
  const { createSchema } = useSchemaStore();
  const { isConnected } = useWalletStore();
  const { isWalletReady, currentAccount } = useWalletOperations();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "email", // default type
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Schema name is required";
    if (!formData.description.trim())
      errs.description = "Description is required";
    if (!formData.type || !schemaTemplates[formData.type])
      errs.type = "Select a valid schema type";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    // Check if wallet is connected and ready
    if (!isConnected || !isWalletReady()) {
      setErrors({
        submit:
          "Wallet not connected or not ready. Please connect your wallet first.",
      });
      setIsLoading(false);
      return;
    }

    // Additional check for current account
    if (!currentAccount?.address) {
      setErrors({
        submit: "Wallet address not available. Please reconnect your wallet.",
      });
      setIsLoading(false);
      return;
    }

    const definition = schemaTemplates[formData.type];
    console.log("Selected schema type:", formData.type);
    console.log("Schema definition:", definition);
    console.log("Current wallet address:", currentAccount.address);

    const definitionJson = JSON.stringify(definition);
    console.log("Stringified definition:", definitionJson);

    if (!definition || !definitionJson) {
      setErrors({ submit: "Invalid schema type or empty definition" });
      setIsLoading(false);
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      definitionJson,
      // You might want to include the wallet address in the payload
      walletAddress: currentAccount.address,
    };

    try {
      const res = await createSchema(payload);
      if (res) {
        setSuccess(true);
        setSuccessMessage(
          `Schema ${formData.name} created successfully! Redirecting to schemas list...`
        );
        setTimeout(() => {
          router.push("/schemas");
        }, 2000); // 2 second delay
      } else {
        throw new Error("Failed");
      }
    } catch (error) {
      console.error("Schema creation error:", error);
      setErrors({ submit: "Failed to create schema" });
    } finally {
      setIsLoading(false);
    }
  };

  // Show wallet connection warning if not ready
  const walletWarning =
    !isConnected || !isWalletReady() ? (
      <Alert variant="destructive" className="flex items-center gap-2 mb-4">
        <Info className="h-4 w-4" />
        <AlertDescription>
          {!isConnected
            ? "Please connect your wallet to create a schema."
            : "Wallet is not ready. Please ensure your wallet is properly connected."}
        </AlertDescription>
      </Alert>
    ) : null;

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
        <Link href="/schemas">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Schemas
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Schema</h1>
          <p className="text-muted-foreground">
            Define a new attestation schema for the Sui blockchain
          </p>
        </div>
      </div>

      {walletWarning}

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Schema Name *</Label>
            <Input
              id="name"
              value={formData.name}
              placeholder="e.g., EmailVerificationV1"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              rows={4}
              className={`w-full p-2 rounded-md border bg-background ${
                errors.description ? "border-red-500" : ""
              }`}
              placeholder="Describe what this schema is used for..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div>
            <Label htmlFor="type">Schema Type *</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full p-2 rounded-md border"
            >
              {Object.keys(schemaTemplates).map((typeKey) => (
                <option key={typeKey} value={typeKey}>
                  {typeKey.charAt(0).toUpperCase() + typeKey.slice(1)}{" "}
                  Attestation
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type}</p>
            )}
          </div>

          {errors.submit && (
            <Alert variant="destructive" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          <Alert className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Creating this schema will deploy it to the Sui blockchain. It
              cannot be changed after creation.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !isConnected || !isWalletReady()}
            >
              {isLoading ? "Creating..." : "Create Schema"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
