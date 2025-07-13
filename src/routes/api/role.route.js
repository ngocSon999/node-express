const express = require('express');
const roleController = require('../../controllers/api/role.controller');
const { checkPermission } = require('../../middlewares/permission.middleware');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *         - permissions
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the role
 *         name:
 *           type: string
 *           description: The name of the role
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of permission names for this role
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the role was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the role was last updated
 */

/**
 * @swagger
 * /role:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - permissions
 *             properties:
 *               name:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: The role was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires 'create role' permission
 */
router.post('/', checkPermission('create role'), roleController.create);

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires 'show role' permission
 */
router.get('/', checkPermission('show role'), roleController.getAll);

/**
 * @swagger
 * /role/{id}:
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: The role was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires 'update role' permission
 *       404:
 *         description: Role not found
 */
router.put('/:id', checkPermission('update role'), roleController.update);

/**
 * @swagger
 * /role/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     responses:
 *       200:
 *         description: The role was deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires 'delete role' permission
 *       404:
 *         description: Role not found
 */
router.delete('/:id', checkPermission('delete role'), roleController.delete);

/**
 * @swagger
 * /role/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires 'show role' permission
 *       404:
 *         description: Role not found
 */
router.get('/:id', checkPermission('show role'), roleController.getById);

module.exports = router;