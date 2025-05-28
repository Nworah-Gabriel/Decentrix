"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAttestationStore } from "@/lib/store"
import { useEffect } from "react"
import { formatDistanceToNow } from "date-fns"

export function AttestationTable() {
  const { attestations, fetchAttestations } = useAttestationStore()

  useEffect(() => {
    fetchAttestations()
  }, [fetchAttestations])

  const getSchemaColor = (schemaType: string) => {
    switch (schemaType) {
      case "WITNESSED_ATTESTATIONS":
        return "bg-yellow-100 text-yellow-800"
      case "ENDORSEMENTS":
        return "bg-green-100 text-green-800"
      case "IDENTITY_VERIFICATION":
        return "bg-blue-100 text-blue-800"
      case "REPUTATION_SCORE":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UID</TableHead>
            <TableHead>Schema</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attestations.map((attestation) => (
            <TableRow key={attestation.uid}>
              <TableCell className="font-mono text-sm">
                <Button variant="link" className="p-0 h-auto font-mono text-blue-600">
                  {attestation.uid.slice(0, 20)}...
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    #{attestation.schemaId}
                  </Badge>
                  <Badge className={`text-xs ${getSchemaColor(attestation.schemaType)}`}>
                    {attestation.schemaType.replace("_", " ")}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm text-blue-600">{attestation.from}</TableCell>
              <TableCell className="font-mono text-sm text-blue-600">{attestation.to}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {attestation.type}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {formatDistanceToNow(new Date(attestation.timestamp), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="p-4 text-center border-t">
        <Button variant="link" className="text-blue-600">
          View all attestations
        </Button>
      </div>
    </div>
  )
}
