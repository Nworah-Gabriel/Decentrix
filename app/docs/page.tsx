import { DocsContent } from "@/components/docs-content";

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
          <p className="text-muted-foreground">
            Learn how to create and manage attestations on the Sui blockchain.
          </p>
        </div>
      </div>

      <DocsContent />
    </div>
  );
}
