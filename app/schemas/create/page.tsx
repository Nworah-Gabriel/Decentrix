"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Info, Code, FileText } from "lucide-react";
import { useSchemaStore } from "@/store/useSchema";

export default function CreateSchemaPage() {
  const router = useRouter();
  const { createSchema } = useSchemaStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    structure: "", // Renamed in form only
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateStep = () => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) errs.name = "Schema name is required";
      if (!formData.description.trim())
        errs.description = "Description is required";
    }

    if (step === 2) {
      if (!formData.structure.trim()) {
        errs.structure = "Structure definition is required";
      } else {
        try {
          JSON.parse(formData.structure);
        } catch {
          errs.structure = "Invalid JSON format";
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsLoading(true);

    try {
      const res = await createSchema({
        name: formData.name,
        description: formData.description,
        definitionJson: formData.structure, // mapped properly here
      });
      if (res) router.push("/schemas");
      else throw new Error("Failed");
    } catch {
      setErrors({ submit: "Failed to create schema" });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <>
          <h3 className="text-lg font-semibold mb-2">Basic Info</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Schema Name *</Label>
              <Input
                id="name"
                value={formData.name}
                placeholder="e.g., Identity Verification"
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
          </div>
          <Button onClick={handleNext} className="mt-6">
            Continue
          </Button>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <h3 className="text-lg font-semibold mb-2">
            Data Structure Definition
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Define the structure of data that this schema supports (in JSON
            format).
          </p>
          <Label htmlFor="structure">Structure *</Label>
          <textarea
            id="structure"
            rows={14}
            className={`w-full p-3 rounded-md border bg-background font-mono text-sm ${
              errors.structure ? "border-red-500" : ""
            }`}
            placeholder={`{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "verified": { "type": "boolean" }
  },
  "required": ["name", "verified"]
}`}
            value={formData.structure}
            onChange={(e) =>
              setFormData({ ...formData, structure: e.target.value })
            }
          />
          {errors.structure && (
            <p className="text-sm text-red-500">{errors.structure}</p>
          )}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleNext}>Preview</Button>
          </div>
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          <h3 className="text-lg font-semibold mb-2">Review & Create</h3>

          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Raw JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="preview">
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
                  <div>
                    <h4 className="font-medium">Structure</h4>
                    <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(JSON.parse(formData.structure), null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="code">
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
                        definitionJson: JSON.parse(formData.structure),
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
            <Alert variant="destructive" className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Creating this schema will deploy it to the Sui blockchain. It
              cannot be changed after creation.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Schema"}
            </Button>
          </div>
        </>
      );
    }

    return null;
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
            Define a new schema on the Sui blockchain
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                n === step
                  ? "bg-blue-500 text-white"
                  : n < step
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {n}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">{renderStep()}</CardContent>
      </Card>
    </div>
  );
}
