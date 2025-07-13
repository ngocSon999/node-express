const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

const userController = require('../../controllers/api/user.controller');
const { checkPermission } = require('../../middlewares/permission.middleware');

const userRoute = express.Router();

// Thêm các route CRUD cơ bản
userRoute.post('/create', 
    checkPermission('create user'),
    upload.single('avatar'), 
    userController.create
);

userRoute.get('/',
    checkPermission('show user'),
    userController.getAll
);

userRoute.get('/:id',
    checkPermission('show user'),
    userController.getById
);

userRoute.put('/update/:id', 
    checkPermission('update user'),
    upload.single('avatar'), 
    userController.update
);

userRoute.delete('/:id',
    checkPermission('delete user'),
    userController.delete
);

module.exports = userRoute;