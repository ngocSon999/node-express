const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const moment = require('moment');
const cookieParser = require('cookie-parser');

// Load .env 
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV.trim()}` : '.env';
const envPath = path.resolve(__dirname, envFile);

if (!process.env.RUN_CPANEL_SERVER && fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    dotenv.config(); 
}

const app = express();
const port = process.env.PORT || 3000;

app.engine('.hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'), 
  helpers: {
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

      if (typeof routes[name] === 'function') {
        return routes[name](param);
      }
      return routes[name] || '#';
    },

    moment: (date, format) => moment(date).format(format || 'YYYY-MM-DD HH:ii:ss'),

    formatPermissions: (permissions) => {
      if (!permissions || !Array.isArray(permissions)) return '';
      return permissions.map(p => p.name).join(', ');
    },

    split: (str) => {
      if (!str) return [];
      const parts = str.split(' ');
      return {
        first: parts[0], // action (create, update, delete, etc)
        last: parts[parts.length - 1], // module (user, role, etc)
        parts: parts
      };
    },
  }
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Phân tích application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Phân tích application/json
app.use(express.json());
app.use(cookieParser());

const apiRoutes = require('./src/routes/api/api');
const webRoutes = require('./src/routes/web/web');

const { requireAuth } = require('./src/middlewares/auth.middleware');

// Protected routes
app.use('/api/v1', apiRoutes);
app.use('/admin', webRoutes);


app.use((err, req, res, next) => {
  console.error('💥 Error Handler:', err);

  const message =
    err?.parent?.sqlMessage ||
    err?.message ||
    'Internal Server Error';

  res.status(err.status || 500).json({
    success: false,
    message,
  });
});


app.listen(port, () => {
    console.log(`✅ Express app listening at http://localhost:${port}`);
});
