import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  value: string;
  loading: boolean;
  onChange: (v: string) => void;
  onResolve: () => void;
};

export function DidRequestTab({ value, loading, onChange, onResolve }: Props) {
  return (
    <div className="space-y-8">
      <div className="flex gap-4 items-center">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && value.trim() && onResolve()}
          placeholder="Enter a DID to resolve"
          className="h-12 text-lg"
        />
        <Button
          onClick={onResolve}
          disabled={loading || !value.trim()}
          className="h-12 px-8 font-semibold"
        >
          {loading ? "Resolving..." : "Resolve DID"}
        </Button>
      </div>

      <Accordion
        type="single"
        collapsible
        defaultValue="item-1"
        className="bg-slate-50 p-4 rounded-lg border"
      >
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="text-sm font-semibold text-slate-600 py-2">
            Supported DID Methods and Test DIDs:
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-white border rounded text-xs font-mono text-slate-500">
                    did:web
                  </span>
                  {/* Add more tags if needed, user image showed many */}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-700 uppercase">WEB</h4>
                  <div
                    className="p-3 bg-slate-200 hover:bg-slate-300 transition-colors rounded cursor-pointer font-mono text-xs break-all text-slate-700"
                    onClick={() => onChange("did:web:danubetech.com")}
                  >
                    did:web:danubetech.com
                  </div>
                  <div
                    className="p-3 bg-slate-200 hover:bg-slate-300 transition-colors rounded cursor-pointer font-mono text-xs break-all text-slate-700"
                    onClick={() => onChange("did:web:identity.foundation")}
                  >
                    did:web:identity.foundation
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
