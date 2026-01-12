import { useState, useEffect, useMemo } from "react";
import { countryService } from "../services/country.service";
import { type Country } from "../types/country.types";

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchCountries = async () => {
      try {
        const data = await countryService.getAllCountries();
        if (mounted) {
          setCountries(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Error loading countries");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCountries();

    return () => {
      mounted = false;
    };
  }, []);

  const getCountryByCode = useMemo(() => {
    return (code: string) => countries.find((c) => c.code === code);
  }, [countries]);

  return {
    countries,
    loading,
    error,
    getCountryByCode,
  };
}
