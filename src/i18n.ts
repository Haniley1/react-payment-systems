import i18n from 'i18next'
import LanguageDetector from "i18next-browser-languagedetector"
import XHR from 'i18next-xhr-backend'
import { initReactI18next } from 'react-i18next'
import languageEN from './localization/en.json'
import languageRU from './localization/ru.json'

i18n
.use(XHR)
.use(LanguageDetector)
.use(initReactI18next)
.init({
    resources: {
        en: languageEN,
        ru: languageRU
    },
    /* No need default language when load the website in browser */
    // lng: "ru",
    /* When react i18next not finding any language to as default in browser */
    fallbackLng: "en",
    /* debugger For Development environment */
    debug: true,
    ns: ["translations"],
    defaultNS: "translations",
    keySeparator: ".",
    interpolation: {
        escapeValue: false,
        formatSeparator: ","
    },
    react: {
        useSuspense: false,
        //wait: true,
        bindI18n: 'languageChanged loaded',
        nsMode: 'default'
    }
})

export default i18n;
