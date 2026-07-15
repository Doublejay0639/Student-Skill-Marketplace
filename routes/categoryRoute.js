import express from'express'
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { createCategory, getCategories } from '../controller/categoryController.js'


const router = express.Router()


/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Web Development
 *               slug:
 *                 type: string
 *                 example: web-development
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admins only
 *       500:
 *         description: Server error
 */
router.post('/', protect, restrictTo, createCategory)

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories
 *       500:
 *         description: Server error
 */
router.get('/', getCategories)

export default router