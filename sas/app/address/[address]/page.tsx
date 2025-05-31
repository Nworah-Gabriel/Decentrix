import { AddressDetail } from "@/components/address-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AddressPageProps {
  params: Promise<{ address: string }>;
}

export default async function AddressPage({ params }: AddressPageProps) {
  const { address } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      <AddressDetail address={address} />
    </div>
  );
}
