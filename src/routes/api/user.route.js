const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

const userController = require('../../controllers/api/user.controller');


const userRoute = express.Router();

userRoute.post('/create', upload.single('avatar'), userController.create);
userRoute.put('/update/:id', upload.single('avatar'), userController.update);



module.exports = userRoute;