import express from 'express'
import {
    register,
    login
} from "../controller/authController.js"

const router = express.Router()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tunde
 *               email:
 *                 type: string
 *                 example: tunde@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
router.post('/register', register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: tunde@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token and user
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Invalid Email or Password
 *       500:
 *         description: Server error
 */
router.post('/login', login)


export default router