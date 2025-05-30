"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAttestationStore } from "@/lib/store";

export default function CreateAttestationPage() {
  const router = useRouter();
  const { allSchemas } = useAttestationStore();
  const [formData, setFormData] = useState({
    schemaId: "",
    to: "",
    data: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would normally make an API call to create the attestation
    // For now, we'll just redirect back to attestations page
    router.push("/attestations");
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

      <Card>
        <CardHeader>
          <CardTitle>Create New Attestation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="schema">Schema</Label>
              <select
                id="schema"
                className="w-full p-2 border rounded-md bg-background"
                value={formData.schemaId}
                onChange={(e) =>
                  setFormData({ ...formData, schemaId: e.target.value })
                }
                required
              >
                <option value="">Select a schema</option>
                {allSchemas.map((schema) => (
                  <option key={schema.id} value={schema.id}>
                    {schema.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">Recipient Address</Label>
              <Input
                id="to"
                placeholder="0x..."
                value={formData.to}
                onChange={(e) =>
                  setFormData({ ...formData, to: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data">Attestation Data (JSON)</Label>
              <textarea
                id="data"
                className="w-full h-32 p-2 border rounded-md bg-background font-mono text-sm"
                placeholder='{"key": "value"}'
                value={formData.data}
                onChange={(e) =>
                  setFormData({ ...formData, data: e.target.value })
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Create Attestation
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
