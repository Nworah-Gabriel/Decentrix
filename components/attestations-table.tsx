"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { useAttestationStore } from "@/lib/store"
import Link from "next/link"

export function AttestationsTable() {
  const { allAttestations } = useAttestationStore()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const totalPages = Math.ceil(allAttestations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAttestations = allAttestations.slice(startIndex, endIndex)

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">UID</th>
                  <th className="text-left p-4 font-medium">Schema</th>
                  <th className="text-left p-4 font-medium">From</th>
                  <th className="text-left p-4 font-medium">To</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Age</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentAttestations.map((attestation) => (
                  <tr key={attestation.uid} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="font-mono text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                        {attestation.uid.slice(0, 12)}...{attestation.uid.slice(-8)}
                      </div>
                    </td>
                    <td className="p-4">
                      <Link href={`/schemas/${attestation.schemaId}`}>
                        <Badge variant="secondary" className="hover:bg-blue-100 cursor-pointer">
                          #{attestation.schemaId}
                        </Badge>
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-sm">
                        {attestation.from.slice(0, 8)}...{attestation.from.slice(-6)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-sm">
                        {attestation.to.slice(0, 8)}...{attestation.to.slice(-6)}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={attestation.type === "WITNESSED" ? "default" : "secondary"}
                        className={
                          attestation.type === "WITNESSED" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : ""
                        }
                      >
                        {attestation.type}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{attestation.age}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/attestations/${attestation.uid}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, allAttestations.length)} of {allAttestations.length}{" "}
          attestations
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
