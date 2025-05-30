"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Plus, X, Info, Code, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export default function CreateSchemaPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    revocable: true,
    resolver: "",
  });
  const [fields, setFields] = useState<SchemaField[]>([
    { name: "", type: "string", required: true, description: "" },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fieldTypes = [
    { value: "string", label: "String", description: "Text data" },
    { value: "uint256", label: "Number", description: "Positive integer" },
    { value: "bool", label: "Boolean", description: "True/false value" },
    { value: "address", label: "Address", description: "Sui address" },
    { value: "bytes32", label: "Hash", description: "32-byte hash" },
    { value: "bytes", label: "Bytes", description: "Arbitrary data" },
  ];

  const addField = () => {
    setFields([
      ...fields,
      { name: "", type: "string", required: true, description: "" },
    ]);
  };

  const removeField = (index: number) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  const updateField = (index: number, updates: Partial<SchemaField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const generateSchemaString = () => {
    return fields
      .filter((field) => field.name.trim())
      .map((field) => `${field.type} ${field.name}`)
      .join(", ");
  };

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.name.trim()) newErrors.name = "Schema name is required";
      if (!formData.description.trim())
        newErrors.description = "Description is required";
    }

    if (stepNumber === 2) {
      fields.forEach((field, index) => {
        if (!field.name.trim()) {
          newErrors[`field_${index}_name`] = "Field name is required";
        }
        if (field.name && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field.name)) {
          newErrors[`field_${index}_name`] = "Invalid field name format";
        }
      });

      if (fields.filter((f) => f.name.trim()).length === 0) {
        newErrors.fields = "At least one field is required";
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const schemaData = {
        ...formData,
        fields: fields.filter((f) => f.name.trim()),
        schema: generateSchemaString(),
      };

      console.log("Creating schema:", schemaData);

      router.push("/schemas");
    } catch (error) {
      console.error("Error creating schema:", error);
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

              <div className="space-y-2">
                <Label htmlFor="resolver">Resolver Contract (Optional)</Label>
                <Input
                  id="resolver"
                  placeholder="0x... (custom resolver contract address)"
                  value={formData.resolver}
                  onChange={(e) =>
                    setFormData({ ...formData, resolver: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Custom logic for attestation validation and processing
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
                  Allow attestations to be revocable
                </Label>
              </div>
            </div>

            <Button onClick={handleNext}>Continue to Fields</Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Schema Fields</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Define the data structure for attestations using this schema.
              </p>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Field {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Field Name *</Label>
                      <Input
                        placeholder="e.g., name, score, verified"
                        value={field.name}
                        onChange={(e) =>
                          updateField(index, { name: e.target.value })
                        }
                        className={
                          errors[`field_${index}_name`] ? "border-red-500" : ""
                        }
                      />
                      {errors[`field_${index}_name`] && (
                        <p className="text-sm text-red-500">
                          {errors[`field_${index}_name`]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Field Type *</Label>
                      <select
                        value={field.type}
                        onChange={(e) =>
                          updateField(index, { type: e.target.value })
                        }
                        className="w-full p-2 border rounded-md bg-background"
                      >
                        {fieldTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label} - {type.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label>Description (Optional)</Label>
                      <Input
                        placeholder="Describe what this field represents..."
                        value={field.description}
                        onChange={(e) =>
                          updateField(index, { description: e.target.value })
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) =>
                            updateField(index, { required: e.target.checked })
                          }
                          className="rounded"
                        />
                        <Label>Required field</Label>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {errors.fields && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>{errors.fields}</AlertDescription>
                </Alert>
              )}

              <Button variant="outline" onClick={addField} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
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
                      <h4 className="font-medium">Configuration</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Revocable:
                          </span>
                          <Badge
                            variant={
                              formData.revocable ? "default" : "secondary"
                            }
                          >
                            {formData.revocable ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Resolver:
                          </span>
                          <span>{formData.resolver || "None"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">
                        Fields ({fields.filter((f) => f.name.trim()).length})
                      </h4>
                      <div className="space-y-2">
                        {fields
                          .filter((f) => f.name.trim())
                          .map((field, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 border rounded"
                            >
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{field.type}</Badge>
                                <span className="font-medium">
                                  {field.name}
                                </span>
                                {field.required && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Required
                                  </Badge>
                                )}
                              </div>
                              {field.description && (
                                <span className="text-sm text-muted-foreground">
                                  {field.description}
                                </span>
                              )}
                            </div>
                          ))}
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
                      Generated Schema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg">
                      <code className="text-sm">{generateSchemaString()}</code>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Schema JSON</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(
                        {
                          name: formData.name,
                          description: formData.description,
                          revocable: formData.revocable,
                          resolver: formData.resolver || null,
                          fields: fields
                            .filter((f) => f.name.trim())
                            .map((f) => ({
                              name: f.name,
                              type: f.type,
                              required: f.required,
                              description: f.description || null,
                            })),
                          schema: generateSchemaString(),
                        },
                        null,
                        2
                      )}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

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
