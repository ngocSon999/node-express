const express = require('express');
const roleController = require('../../controllers/api/role.controller');

const router = express.Router();

router.post('/', roleController.create);
router.get('/', roleController.getAll);
router.put('/:id', roleController.update);
router.delete('/:id', roleController.delete);
router.get('/:id', roleController.getById);

module.exports = router;