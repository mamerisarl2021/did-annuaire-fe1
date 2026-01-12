import { type RestCountryResponse, type Country } from "../types/country.types";
import { countryMapper } from "../mappers/country.mapper";

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
      console.error("Failed to fetch countries", error);
      throw error;
    }
  },
};
