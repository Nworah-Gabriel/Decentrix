import { AttestationDetail } from "@/components/attestation-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface AttestationPageProps {
  params: Promise<{ id: string }>
}

export default async function AttestationPage({ params }: AttestationPageProps) {
  const { id } = await params

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

      <AttestationDetail id={id} />
    </div>
  )
}
