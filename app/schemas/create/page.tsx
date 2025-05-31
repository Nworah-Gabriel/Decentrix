"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Info, Code, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSchemaStore } from "@/store/useSchema";

export default function CreateSchemaPage() {
  const router = useRouter();
  const { createSchema } = useSchemaStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    definitionJson: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.name.trim()) newErrors.name = "Schema name is required";
      if (!formData.description.trim())
        newErrors.description = "Description is required";
    }

    if (stepNumber === 2) {
      if (!formData.definitionJson.trim()) {
        newErrors.definitionJson = "Definition JSON is required";
      } else {
        try {
          JSON.parse(formData.definitionJson);
        } catch {
          newErrors.definitionJson = "Invalid JSON format";
        }
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
    if (!validateStep(2)) return;

    setIsLoading(true);

    try {
      const result = await createSchema({
        name: formData.name,
        description: formData.description,
        definitionJson: formData.definitionJson,
      });

      if (result) {
        router.push("/schemas");
      } else {
        setErrors({ submit: "Failed to create schema" });
      }
    } catch (error) {
      console.error("Error creating schema:", error);
      setErrors({ submit: "Failed to create schema" });
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
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Provide basic information about your schema.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Schema Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Identity Verification, Academic Credential"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  className={`w-full h-24 p-2 border rounded-md bg-background ${
                    errors.description ? "border-red-500" : ""
                  }`}
                  placeholder="Describe the purpose and use case of this schema..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>
            </div>

            <Button onClick={handleNext}>Continue to Definition</Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Schema Definition</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Define the JSON structure for attestations using this schema.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="definitionJson">Definition JSON *</Label>
                <textarea
                  id="definitionJson"
                  className={`w-full h-64 p-3 border rounded-md bg-background font-mono text-sm ${
                    errors.definitionJson ? "border-red-500" : ""
                  }`}
                  placeholder={`{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Full name of the person"
    },
    "verified": {
      "type": "boolean",
      "description": "Whether the identity is verified"
    },
    "score": {
      "type": "number",
      "description": "Verification score from 0-100"
    }
  },
  "required": ["name", "verified"]
}`}
                  value={formData.definitionJson}
                  onChange={(e) =>
                    setFormData({ ...formData, definitionJson: e.target.value })
                  }
                />
                {errors.definitionJson && (
                  <p className="text-sm text-red-500">
                    {errors.definitionJson}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Enter a valid JSON schema definition
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => setStep(1)} variant="outline">
                Back
              </Button>
              <Button onClick={() => setStep(3)}>Preview Schema</Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review & Create</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Review your schema before deploying it to the Sui blockchain.
              </p>
            </div>

            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Schema Code</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <CardTitle>{formData.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      {formData.description}
                    </p>

                    <div className="space-y-2">
                      <h4 className="font-medium">Schema Definition</h4>
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm overflow-x-auto">
                          {JSON.stringify(
                            JSON.parse(formData.definitionJson),
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Schema JSON
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(
                        {
                          name: formData.name,
                          description: formData.description,
                          definitionJson: JSON.parse(formData.definitionJson),
                        },
                        null,
                        2
                      )}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {errors.submit && (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Creating this schema will deploy it to the Sui blockchain. Once
                created, the schema structure cannot be modified.
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-2">
              <Button onClick={() => setStep(2)} variant="outline">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isLoading ? "Creating..." : "Create Schema"}
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
            Define a new attestation schema on the Sui blockchain
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((stepNumber) => (
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
