import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Country } from "@/lib/features/countries/types/country.types";

interface CountrySelectProps {
  countries: Country[];
  value?: string;
  onChange: (country: Country) => void;
  disabled?: boolean;
  className?: string;
}

export function CountrySelect({
  countries,
  value,
  onChange,
  disabled,
  className,
}: CountrySelectProps) {
  const handleValueChange = (code: string) => {
    const country = countries.find((c) => c.code === code);
    if (country) {
      onChange(country);
    }
  };

  return (
    <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder="Sélectionner un pays" />
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <div className="flex items-center gap-2 flex-1 w-full">
              <img
                src={country.flagUrl}
                alt={country.name}
                className="h-3 w-5 object-cover border shrink-0"
                loading="lazy"
              />
              <span className="truncate">{country.name}</span>
              <span className="ml-auto text-muted-foreground text-xs pl-2">
                ({country.phonePrefix})
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
