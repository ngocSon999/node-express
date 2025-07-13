const express = require('express');
const { requireAuth } = require('../../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication endpoints
 *   - name: Users
 *     description: User management endpoints
 *   - name: Roles
 *     description: Role management endpoints
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: Unauthorized
 *     ForbiddenError:
 *       description: User does not have required permissions
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: You do not have permission to perform this action
 */

const router = express.Router();

const userRoute = require('./user.route');
const roleRoute = require('./role.route');
const authRoute = require('./auth.route');

router.use('/user', requireAuth, userRoute);
router.use('/role', requireAuth, roleRoute);
router.use('/auth', authRoute);

module.exports = router;