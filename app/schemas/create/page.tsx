"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateSchemaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fields: [""],
  });

  const addField = () => {
    setFormData({ ...formData, fields: [...formData.fields, ""] });
  };

  const removeField = (index: number) => {
    const newFields = formData.fields.filter((_, i) => i !== index);
    setFormData({ ...formData, fields: newFields });
  };

  const updateField = (index: number, value: string) => {
    const newFields = [...formData.fields];
    newFields[index] = value;
    setFormData({ ...formData, fields: newFields });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would normally make an API call to create the schema
    // For now, we'll just redirect back to schemas page
    router.push("/schemas");
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

      <Card>
        <CardHeader>
          <CardTitle>Create New Schema</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Schema Name</Label>
              <Input
                id="name"
                placeholder="e.g., Identity Verification"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="w-full h-24 p-2 border rounded-md bg-background"
                placeholder="Describe the purpose and structure of this schema"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Schema Fields</Label>
              {formData.fields.map((field, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Field ${index + 1} (e.g., name, age, score)`}
                    value={field}
                    onChange={(e) => updateField(index, e.target.value)}
                    required
                  />
                  {formData.fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={addField}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Create Schema
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
