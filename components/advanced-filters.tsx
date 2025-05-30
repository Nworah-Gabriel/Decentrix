"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Download } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterState {
  dateRange: {
    from?: string;
    to?: string;
  };
  schemaIds: string[];
  attestationType: string;
  revoked: string;
  minAmount?: number;
  maxAmount?: number;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  onExport: () => void;
}

export function AdvancedFilters({
  onFiltersChange,
  onExport,
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {},
    schemaIds: [],
    attestationType: "all",
    revoked: "all",
  });

  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const clearFilters = () => {
    const cleared = {
      dateRange: {},
      schemaIds: [],
      attestationType: "all",
      revoked: "all",
    };
    setFilters(cleared);
    onFiltersChange(cleared);
  };

  const hasActiveFilters =
    filters.dateRange.from ||
    filters.dateRange.to ||
    filters.schemaIds.length > 0 ||
    filters.attestationType !== "all" ||
    filters.revoked !== "all";

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
            {hasActiveFilters && (
              <Badge
                variant="secondary"
                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
              >
                !
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96" align="end">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Advanced Filters</CardTitle>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Range */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label
                      htmlFor="from"
                      className="text-xs text-muted-foreground"
                    >
                      From
                    </Label>
                    <Input
                      id="from"
                      type="date"
                      value={filters.dateRange.from || ""}
                      onChange={(e) =>
                        updateFilters({
                          dateRange: {
                            ...filters.dateRange,
                            from: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="to"
                      className="text-xs text-muted-foreground"
                    >
                      To
                    </Label>
                    <Input
                      id="to"
                      type="date"
                      value={filters.dateRange.to || ""}
                      onChange={(e) =>
                        updateFilters({
                          dateRange: {
                            ...filters.dateRange,
                            to: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Attestation Type */}
              <div className="space-y-2">
                <Label>Attestation Type</Label>
                <select
                  value={filters.attestationType}
                  onChange={(e) =>
                    updateFilters({ attestationType: e.target.value })
                  }
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="WITNESSED">Witnessed</option>
                  <option value="SELF">Self</option>
                </select>
              </div>

              {/* Revocation Status */}
              <div className="space-y-2">
                <Label>Revocation Status</Label>
                <select
                  value={filters.revoked}
                  onChange={(e) => updateFilters({ revoked: e.target.value })}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="all">All</option>
                  <option value="false">Active Only</option>
                  <option value="true">Revoked Only</option>
                </select>
              </div>

              {/* Schema IDs */}
              <div className="space-y-2">
                <Label>Schema IDs (comma separated)</Label>
                <Input
                  placeholder="1, 2, 3..."
                  value={filters.schemaIds.join(", ")}
                  onChange={(e) =>
                    updateFilters({
                      schemaIds: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Button onClick={() => setIsOpen(false)} className="flex-1">
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>

      <Button variant="outline" onClick={onExport}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
  );
}
