import express from 'express'
import { protect } from "../middlewares/authMiddleware.js";
import {
    createListing,
    getListings,
    fetchListingById,
    updateListing,
    deleteListing
} from "../controller/listingController.js"


const router = express.Router()


/**
 * @swagger
 * /listings:
 *   post:
 *     summary: Create a new skill listing
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, price, categoryId]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Listing created
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', protect, createListing)

/**
 * @swagger
 * /listings:
 *   get:
 *     summary: Get all listings with pagination and filtering
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Results per page
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *     responses:
 *       200:
 *         description: List of listings with pagination
 *       500:
 *         description: Server error
 */
router.get('/', getListings)

/**
 * @swagger
 * /listings/{id}:
 *   get:
 *     summary: Get a single listing by ID
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Listing details
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Server error
 */
router.get('/:id', fetchListingById)

/**
 * @swagger
 * /listings/{id}:
 *   patch:
 *     summary: Update a listing
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Listing updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the listing owner
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', protect, updateListing)

/**
 * @swagger
 * /listings/{id}:
 *   delete:
 *     summary: Delete a listing
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Listing deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the listing owner
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', protect, deleteListing)

export default router;