import { useSelector } from "react-redux";
import i18n from "../i18n";
import { RootState } from "../store";
import { useMemo } from "react";

const useTranslate = () => {
  const language = useSelector(
    (state: RootState) => state.language.currentLanguage
  );

  const t = useMemo(
    () => (key: string) => i18n.t(key, { lng: language }),
    [language]
  );

  return { t };
};

export default useTranslate;
