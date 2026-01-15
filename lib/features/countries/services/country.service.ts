import { type RestCountryResponse, type Country } from "../types/country.types";
import { countryMapper } from "../mappers/country.mapper";
import { logger } from "@/lib/shared/services/logger.service";

const API_URL = "https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags";

export const countryService = {
  async getAllCountries(): Promise<Country[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Country API failed: ${response.statusText}`);
      }

      const data: RestCountryResponse[] = await response.json();
      return countryMapper.toDomainList(data);
    } catch (error) {
      logger.error("Failed to fetch countries from REST Countries API", error, { apiUrl: API_URL });
      throw error;
    }
  },
};
