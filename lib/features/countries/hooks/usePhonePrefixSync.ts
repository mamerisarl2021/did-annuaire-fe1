import { type UseFormReturn } from "react-hook-form";
import type { Country } from "../types/country.types";

interface UsePhonePrefixSyncParams<T extends { phone?: string }> {
  form: UseFormReturn<T>;
  countries: Country[];
}

export function usePhonePrefixSync<T extends { phone?: string }>({
  form,
  countries,
}: UsePhonePrefixSyncParams<T>) {
  const syncPhonePrefix = (newCountry: Country, oldCountryCode?: string) => {
    const currentPhone = String(form.getValues("phone" as any) || "");
    const oldCountry = countries.find((c) => c.code === oldCountryCode);
    const oldPrefix = oldCountry?.phonePrefix;

    const isUnmodified =
      !currentPhone.trim() || (oldPrefix && currentPhone.trim() === oldPrefix.trim());

    if (isUnmodified) {
      form.setValue("phone" as any, `${newCountry.phonePrefix} ` as any);
    }
  };

  return { syncPhonePrefix };
}
