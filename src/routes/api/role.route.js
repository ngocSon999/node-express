const express = require('express');
const roleController = require('../../controllers/api/role.controller');
const { checkPermission } = require('../../middlewares/permission.middleware');

const router = express.Router();

router.post('/', checkPermission('create role'), roleController.create);
router.get('/', checkPermission('show role'), roleController.getAll);
router.put('/:id', checkPermission('update role'), roleController.update);
router.delete('/:id', checkPermission('delete role'), roleController.delete);
router.get('/:id', checkPermission('show role'), roleController.getById);

module.exports = router;