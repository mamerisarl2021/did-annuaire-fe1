import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle, Copy, ExternalLink } from "lucide-react";

type VerificationMethod = {
  id: string;
  type: string;
};

export type DidResult = {
  did: string;
  url: string;
  document: {
    verificationMethod?: VerificationMethod[];
    [key: string]: unknown;
  };
};

type Props = {
  result: DidResult;
  onCopy: (text: string) => void;
};

export function DidResultCard({ result, onCopy }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[#36B37E]" />
              DID Resolved Successfully
            </CardTitle>
            <p className="font-mono text-sm text-[#5E6C84] mt-2 break-all">{result.did}</p>
          </div>
          <Badge variant="default">Verified</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Document URL */}
        <div>
          <Label className="text-xs text-[#5E6C84] uppercase">Document URL</Label>

          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 text-sm bg-[#F4F5F7] px-3 py-2 rounded break-all">
              {result.url}
            </code>

            <Button variant="outline" size="sm" onClick={() => onCopy(result.url)}>
              <Copy className="h-4 w-4" />
            </Button>

            <a href={result.url} target="_blank" rel="noopener noreferrer" title="Get document">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>

        {/* Verification Methods */}
        {Array.isArray(result.document.verificationMethod) &&
          result.document.verificationMethod.length > 0 && (
            <div>
              <Label className="text-xs text-[#5E6C84] uppercase">Verification Methods</Label>

              <div className="mt-2 space-y-2">
                {result.document.verificationMethod.map((method, index) => (
                  <div key={index} className="bg-[#F4F5F7] px-3 py-2 rounded text-sm">
                    <div className="font-medium text-[#172B4D]">{method.id}</div>
                    <div className="text-[#5E6C84]">Type: {method.type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Full Document */}
        <div>
          <Label className="text-xs text-[#5E6C84] uppercase">Full Document</Label>

          <pre className="mt-2 bg-[#091E42] text-[#FAFBFC] p-4 rounded-lg overflow-x-auto text-sm">
            {JSON.stringify(result.document, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
