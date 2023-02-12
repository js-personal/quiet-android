import { I18nManager } from 'react-native';
import { memoize } from 'lodash';
import * as RNLocalize from "react-native-localize";
import * as i18nBase from 'i18n-js';


const i18n = new i18nBase.I18n();

const translationFilesGetters = {
    en: () => require("../langs/en.js").default,
    fr: () => require("../langs/fr.js").default,
};
  
  const translate = memoize(
      (key, config?: object) => i18n.t(key, config || {}),
      (key, config?: object) => (config ? key + JSON.stringify(config) : key),
    );

  const fallback = { languageTag: "en", isRTL: false };

  const loadI18nLanguage = (lang: string | undefined) => {
    if (i18n.locale === lang && i18n.translations[lang]) return;
    let LANG, RTL;
    if (!lang) {
      let { languageTag, isRTL } =
        RNLocalize.findBestAvailableLanguage(Object.keys(translationFilesGetters)) ||
        fallback;
      LANG = languageTag;
      RTL = isRTL;
    }
    else {
      LANG = lang;
      RTL = false;
    }

    if (translate.cache.clear !== undefined) translate.cache.clear();

    I18nManager.forceRTL(RTL);

    i18n.translations = {
      [LANG]:  translationFilesGetters[LANG as keyof typeof translationFilesGetters](),
    };

    i18n.locale = LANG;

  }
    
export default () => ({
    translate,
    loadI18nLanguage,
})