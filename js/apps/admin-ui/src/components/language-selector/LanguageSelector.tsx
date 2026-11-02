import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
} from "@patternfly/react-core";
import { GlobeIcon } from "@patternfly/react-icons";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { storeLocale } from "../../i18n/locale-preference";
import { localeToDisplayName } from "../../util";
import useLocale from "../../utils/useLocale";

export const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const supportedLocales = useLocale();

  const options = useMemo(
    () =>
      supportedLocales
        .map((locale) => ({
          locale,
          name: localeToDisplayName(locale, locale) || locale,
        }))
        .sort((a, b) => a.name.localeCompare(b.name, i18n.language)),
    [supportedLocales, i18n.language],
  );

  const current = options.find(({ locale }) => locale === i18n.language);

  const onSelect = async (locale: string) => {
    setOpen(false);
    storeLocale(locale);
    await i18n.changeLanguage(locale);
  };

  return (
    <Dropdown
      popperProps={{ position: "end" }}
      isOpen={open}
      onOpenChange={setOpen}
      onSelect={(_, value) => onSelect(value as string)}
      toggle={(ref) => (
        <MenuToggle
          ref={ref}
          variant="default"
          icon={<GlobeIcon />}
          onClick={() => setOpen(!open)}
          isExpanded={open}
          aria-label={t("selectLanguage")}
          id="language-selector"
          data-testid="language-selector-toggle"
        >
          {current?.name ?? i18n.language}
        </MenuToggle>
      )}
    >
      <DropdownList>
        {options.map(({ locale, name }) => (
          <DropdownItem
            key={locale}
            value={locale}
            isSelected={locale === i18n.language}
            data-testid={`language-selector-${locale}`}
          >
            {name}
          </DropdownItem>
        ))}
      </DropdownList>
    </Dropdown>
  );
};
