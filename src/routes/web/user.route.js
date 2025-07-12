const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

const userController = require('../../controllers/web/user.controller');


const userWebRoute = express.Router();

userWebRoute.get('/', userController.getAllUsers);
userWebRoute.get('/delete/:id', userController.getDelete);
userWebRoute.get('/edit/:id', userController.getEdit);
userWebRoute.get('/:id', userController.getDetail);



module.exports = userWebRoute;