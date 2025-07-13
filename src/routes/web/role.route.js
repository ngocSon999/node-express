const express = require('express');
const roleController = require('../../controllers/web/role.controller');
const { checkPermission } = require('../../middlewares/permission.middleware');
const roleWebRoute = express.Router();

roleWebRoute.get('/', checkPermission('show role'),  roleController.getAllRoles);
roleWebRoute.get('/create', checkPermission('create role'),  roleController.getCreateForm);
roleWebRoute.get('/edit/:id', checkPermission('update role'),  roleController.getEditForm);

module.exports = roleWebRoute;