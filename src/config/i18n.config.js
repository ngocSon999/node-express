const path = require('path');
const i18n = require('i18n');

i18n.configure({
    locales: ['en', 'vi'],
    defaultLocale: 'en',
    directory: path.join(__dirname, '..', 'locales'),
    objectNotation: true,
    updateFiles: false,
    syncFiles: false,
    cookie: 'lang',
    api: {
        __: 't',
        __n: 'tn'
    },
    header: 'accept-language',
    queryParameter: 'lang',
    register: global
});

module.exports = i18n;