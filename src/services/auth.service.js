const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('./user.service');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

module.exports.login = async (email, password) => {
    try {
        // Find user by email
        const user = await userService.findByEmail(email);
        if (!user) {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email,
                name: user.name
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return {
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar
                }
            }
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            message: 'An error occurred during login'
        };
    }
};

module.exports.verifyToken = async (token) => {
    try {
        if (!token) {
            return {
                success: false,
                message: 'No token provided'
            };
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await userService.findByPk(decoded.id);

        if (!user) {
            return {
                success: false,
                message: 'User not found'
            };
        }

        return {
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                phone: user.phone,
                roles: user.roles
            }
        };
    } catch (error) {
        console.error('❌ JWT Verify Error:', error.name, '-', error.message);
        return {
            success: false,
            message: 'Invalid token'
        };
    }
};