export interface RestCountryResponse {
  name: {
    common: string;
    official: string;
    nativeName: Record<string, { official: string; common: string }>;
  };
  cca2: string;
  idd: {
    root: string;
    suffixes?: string[];
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
}

export interface Country {
  name: string;
  code: string;
  phonePrefix: string;
  flagUrl: string;
}

export interface CountryServiceState {
  countries: Country[];
  loading: boolean;
  error: string | null;
}
