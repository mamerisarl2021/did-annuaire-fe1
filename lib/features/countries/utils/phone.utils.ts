import { type RestCountryResponse } from "../types/country.types";

/**
 * Phone Utils
 * Handles extraction and formatting of phone prefixes from API data
 */

export const getPhonePrefix = (idd: RestCountryResponse["idd"]): string => {
  if (!idd.root) return "";
  if (idd.suffixes && idd.suffixes.length === 1) {
    return `${idd.root}${idd.suffixes[0]}`;
  }
  return idd.root;
};

/**
 * Format phone number (optional helper for UI input)
 */
export const formatWithPrefix = (phone: string, prefix: string): string => {
  if (phone.startsWith(prefix)) return phone;
  return `${prefix} ${phone || ""}`;
};
