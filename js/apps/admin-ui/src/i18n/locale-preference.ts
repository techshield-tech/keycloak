const LOCALE_STORAGE_KEY = "keycloak.admin.locale";

const RTL_LOCALES = [
  "ar",
  "dv",
  "fa",
  "ha",
  "he",
  "iw",
  "ji",
  "ps",
  "sd",
  "ug",
  "ur",
  "yi",
];

export const isRtlLocale = (locale?: string) =>
  !!locale && RTL_LOCALES.includes(locale);

export const getStoredLocale = () => {
  try {
    return localStorage.getItem(LOCALE_STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
};

export const storeLocale = (locale: string) => {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    return;
  }
};
