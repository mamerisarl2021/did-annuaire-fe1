import { type RestCountryResponse, type Country } from "../types/country.types";
import { getPhonePrefix } from "../utils/phone.utils";

export const countryMapper = {
  toDomain(raw: RestCountryResponse): Country {
    return {
      name: raw.name.common,
      code: raw.cca2,
      phonePrefix: getPhonePrefix(raw.idd),
      flagUrl: raw.flags.svg,
    };
  },

  toDomainList(rawList: RestCountryResponse[]): Country[] {
    return rawList.map(this.toDomain).sort((a, b) => a.name.localeCompare(b.name));
  },
};
