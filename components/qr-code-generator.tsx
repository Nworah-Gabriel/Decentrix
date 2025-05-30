"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Download, Share, Copy } from "lucide-react";

interface QRCodeGeneratorProps {
  attestationId?: string;
}

export function QRCodeGenerator({ attestationId }: QRCodeGeneratorProps) {
  const [uid, setUid] = useState(attestationId || "");
  const [qrGenerated, setQrGenerated] = useState(false);

  const generateQR = () => {
    if (uid.trim()) {
      setQrGenerated(true);
    }
  };

  const downloadQR = () => {
    // In real app, this would generate and download the QR code
    console.log("Downloading QR code for:", uid);
  };

  const shareQR = () => {
    const url = `${window.location.origin}/attestations/${uid}`;
    navigator.share?.({
      title: "Attestation",
      text: "Check out this attestation",
      url,
    }) || navigator.clipboard.writeText(url);
  };

  const copyLink = () => {
    const url = `${window.location.origin}/attestations/${uid}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="uid">Attestation UID</Label>
          <div className="flex gap-2">
            <Input
              id="uid"
              placeholder="0x..."
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              className="flex-1"
            />
            <Button onClick={generateQR} disabled={!uid.trim()}>
              Generate
            </Button>
          </div>
        </div>

        {qrGenerated && (
          <div className="space-y-4">
            {/* QR Code Placeholder */}
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-muted border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">QR Code for</p>
                  <p className="text-xs font-mono">{uid.slice(0, 16)}...</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" onClick={downloadQR}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={shareQR}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={copyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
