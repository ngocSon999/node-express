const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const { checkPermission } = require('../../middlewares/permission.middleware');

const userController = require('../../controllers/web/user.controller');


const userWebRoute = express.Router();

userWebRoute.get('/', checkPermission('show user'), userController.getAllUsers);
userWebRoute.get('/create', checkPermission('create user'), userController.getCreate);
userWebRoute.get('/edit/:id', checkPermission('update user'), userController.getEdit);
userWebRoute.get('/delete/:id', checkPermission('delete user'), userController.getDelete);
userWebRoute.get('/:id', checkPermission('show user'), userController.getDetail);

module.exports = userWebRoute;