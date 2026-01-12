import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  value: string;
  loading: boolean;
  onChange: (v: string) => void;
  onVerify: () => void;
};

export function DidVerifyForm({ value, loading, onChange, onVerify }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="did-url">DID Identifier</Label>
        <Input
          id="did-url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onVerify()}
          placeholder="did:web:example.com or https://..."
          className="h-10"
        />
      </div>
      <Button onClick={onVerify} disabled={loading} className="w-full">
        {loading ? "Verifying..." : "Verify DID"}
      </Button>
    </div>
  );
}
