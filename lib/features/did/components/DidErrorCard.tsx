import { Card, CardContent } from "@/components/ui/card";

export function DidErrorCard({ message }: { message: string }) {
  return (
    <Card className="border-[#FF5630] bg-[#FFEBE6] mb-8">
      <CardContent className="pt-6">
        <p className="text-[#BF2600]">{message}</p>
      </CardContent>
    </Card>
  );
}
