import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import translationUS from './locales/us/translation.json';
import notificationUS from './locales/us/notification.json';
import translationVN from './locales/vn/translation.json';
import notificationVN from './locales/vn/notification.json';

// the translations
const resources = {
    us: {
        translation: translationUS,
        notification: notificationUS
    },
    vn: {
        translation: translationVN,
        notification: notificationVN
    }
};

i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'us',
        debug: true,
        ns: ['translation', 'notification'], // Specify the namespaces
        defaultNS: 'translation', // Default namespace
        interpolation: {
            escapeValue: false // not needed for react as it escapes by default
        }
    });

export default i18n;
