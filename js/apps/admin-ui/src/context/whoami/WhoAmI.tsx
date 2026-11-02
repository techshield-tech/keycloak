import type WhoAmIRepresentation from "@keycloak/keycloak-admin-client/lib/defs/whoAmIRepresentation";
import {
  createNamedContext,
  KeycloakSpinner,
  useEnvironment,
  useFetch,
  useRequiredContext,
} from "@keycloak/keycloak-ui-shared";
import { PropsWithChildren, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { DEFAULT_LOCALE } from "../../i18n/constants";
import { getStoredLocale, isRtlLocale } from "../../i18n/locale-preference";
import useLocale from "../../utils/useLocale";
import { useRealm } from "../realm-context/RealmContext";

type WhoAmIProps = {
  refresh: () => void;
  whoAmI: WhoAmIRepresentation;
};

export const WhoAmIContext = createNamedContext<WhoAmIProps | undefined>(
  "WhoAmIContext",
  undefined,
);

export const useWhoAmI = () => useRequiredContext(WhoAmIContext);

export const WhoAmIContextProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useTranslation();
  const { adminClient } = useAdminClient();
  const { environment } = useEnvironment();

  const [whoAmI, setWhoAmI] = useState<WhoAmIRepresentation>();
  const { realm } = useRealm();
  const [key, setKey] = useState(0);
  const supportedLocales = useLocale();
  const storedLocale = getStoredLocale();
  const locale =
    storedLocale && supportedLocales.includes(storedLocale)
      ? storedLocale
      : whoAmI?.locale;

  useFetch(
    async () => {
      try {
        return await adminClient.whoAmI.find({
          realm: environment.realm,
          currentRealm: realm,
        });
      } catch (error) {
        console.warn(
          "Unable to fetch whoami, falling back to empty defaults.",
          error,
        );

        return {
          realm: "",
          userId: "",
          displayName: "",
          locale: DEFAULT_LOCALE,
          createRealm: false,
          realm_access: {},
          temporary: false,
        };
      }
    },
    setWhoAmI,
    [key, environment.realm, realm],
  );

  useFetch(
    async () => {
      if (locale) {
        await i18n.changeLanguage(locale);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {}, // noop
    [locale],
  );

  useEffect(() => {
    if (isRtlLocale(i18n.language)) {
      document.documentElement.setAttribute("dir", "rtl");
    } else {
      document.documentElement.removeAttribute("dir");
    }
  }, [i18n.language]);

  if (!whoAmI) {
    return <KeycloakSpinner />;
  }

  return (
    <WhoAmIContext.Provider value={{ refresh: () => setKey(key + 1), whoAmI }}>
      {children}
    </WhoAmIContext.Provider>
  );
};
