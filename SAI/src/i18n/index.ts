import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import kn from "./locales/kn.json"; 
const resources = {
  en: { translation: en },
  hi: { translation: hi },
  kn: { translation: kn },
};

const fallback = { languageTag: "en", isRTL: false };

const { languageTag } =
  RNLocalize.findBestLanguageTag(Object.keys(resources)) || fallback;

i18n
  .use(initReactI18next)
  .init({
    lng: languageTag,
    fallbackLng: "en",
    resources,
    interpolation: { escapeValue: false },
  });

export default i18n;