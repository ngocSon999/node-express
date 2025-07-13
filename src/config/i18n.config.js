const path = require('path');
const i18n = require('i18n');

i18n.configure({
    locales: ['en', 'vi'],
    defaultLocale: 'en',
    directory: path.join(__dirname, '../locales'),
    objectNotation: true,
    updateFiles: false,
    syncFiles: false,
    cookie: 'lang',
    api: {
        __: '__',   // ✅ phải để là '__' nếu bạn dùng req.__()
        __n: '__n'
    },
    header: 'accept-language',
    queryParameter: 'lang',
    register: global
});

module.exports = i18n;