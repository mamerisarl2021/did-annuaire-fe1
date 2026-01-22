import { type UseFormReturn, type Path, type PathValue } from "react-hook-form";
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
    const currentPhone = String(form.getValues("phone" as Path<T>) || "");
    const oldCountry = countries.find((c) => c.code === oldCountryCode);
    const oldPrefix = oldCountry?.phonePrefix;

    const isUnmodified =
      !currentPhone.trim() || (oldPrefix && currentPhone.trim() === oldPrefix.trim());

    if (isUnmodified) {
      form.setValue("phone" as Path<T>, `${newCountry.phonePrefix} ` as PathValue<T, Path<T>>);
    }
  };

  return { syncPhonePrefix };
}
