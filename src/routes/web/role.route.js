const express = require('express');
const roleController = require('../../controllers/web/role.controller');

const roleWebRoute = express.Router();

roleWebRoute.get('/', roleController.getAllRoles);
roleWebRoute.get('/create', roleController.getCreateForm);
roleWebRoute.get('/edit/:id', roleController.getEditForm);

module.exports = roleWebRoute;