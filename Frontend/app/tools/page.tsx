import { ToolsGrid } from "@/components/tools-grid";

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Developer Tools</h1>
          <p className="text-muted-foreground">
            Utilities and tools for working with attestations on Sui blockchain.
          </p>
        </div>
      </div>

      <ToolsGrid />
    </div>
  );
}
