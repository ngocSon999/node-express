const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const moment = require('moment');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger.config');
const i18n = require('./src/config/i18n.config'); // ✅ Import đúng i18n config

// Load .env trước
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV.trim()}` : '.env';
const envPath = path.resolve(__dirname, envFile);
if (!process.env.RUN_CPANEL_SERVER && fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const app = express();
const port = process.env.PORT || 3000;

// ✅ Middleware i18n PHẢI chạy TRƯỚC session, flash và các middleware khác
app.use(i18n.init);

// View engine setup
app.engine('.hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  helpers: {
     // Đổi từ gọi i18n.__ sang dùng t từ res.locals
    t: function (...args) {
      const options = args.pop(); // Handlebars helper truyền options cuối cùng
      const key = args[0];
      if (typeof options.data.root.t === 'function') {
        return options.data.root.t(key);
      } else {
        return key; // fallback nếu helper t chưa sẵn
      }
    },
    eq: (v1, v2) => v1 === v2,
    includes: (array, value) => Array.isArray(array) && array.includes(value),
    json: function(context) {
      return JSON.stringify(context);
    },
    routes: (name, param) => {
      const routes = {
        login: '/admin/auth/login',
        dashboard: '/admin',
        userManage: '/admin/user',
        usercreate: '/admin/user/create',
        roleManage: '/admin/role',
        roleCreate: '/admin/role/create',
        userDetail: (id) => `/admin/user/${id}`,
        userEdit: (id) => `/admin/user/edit/${id}`,
        userDelete: (id) => `/admin/user/delete/${id}`,
      };
      return typeof routes[name] === 'function' ? routes[name](param) : routes[name] || '#';
    },
    moment: (date, format) => moment(date).format(format || 'YYYY-MM-DD HH:mm:ss'),
    formatPermissions: (permissions) =>
      Array.isArray(permissions) ? permissions.map(p => p.name).join(', ') : '',
    split: (str) => {
      if (!str) return [];
      const parts = str.split(' ');
      return { first: parts[0], last: parts[parts.length - 1], parts };
    },
    hasPermission: (user, requiredPermission) =>
      user?.roles?.some(role =>
        role.permissions?.some(permission => permission.name === requiredPermission)
      ),
    },
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Parse body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Session & Flash
app.use(session({
  secret: process.env.SESSION_SECRET || 'test_flash',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// Language detection middleware (sau i18n.init)
app.use((req, res, next) => {
  const supportedLanguages = ['en', 'vi'];
  const lang = req.query.lang || req.cookies.lang || req.acceptsLanguages(supportedLanguages) || 'en';

  if (!req.cookies.lang) {
    res.cookie('lang', lang, { maxAge: 365 * 24 * 60 * 60 * 1000 }); // 1 year
  }

  req.setLocale(lang);
  res.locals.currentLocale = lang;

  // ✅ gán hàm t để sử dụng trong view
  res.locals.t = typeof req.__ === 'function' ? req.__.bind(req) : () => '';

  next();
});

// Flash to view
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Language switch route
app.get('/language/:lang', (req, res) => {
  const lang = req.params.lang;
  const supportedLanguages = ['en', 'vi'];

  if (supportedLanguages.includes(lang)) {
    res.cookie('lang', lang, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: false,
    });
  }

  res.redirect(req.get('Referer') || '/');
});

// Routes
const apiRoutes = require('./src/routes/api/api');
const webRoutes = require('./src/routes/web/web');
const { requireAuth } = require('./src/middlewares/auth.middleware');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: { persistAuthorization: false },
  customSiteTitle: 'API Documentation',
}));

app.use('/api/v1', apiRoutes);
app.use('/admin', webRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Error Handler:', err);
  const message = err?.parent?.sqlMessage || err?.message || 'Internal Server Error';
  res.status(err.status || 500).json({ success: false, message });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Express app listening at http://localhost:${port}`);
});
