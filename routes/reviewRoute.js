import express from 'express'
import {
    createReview, getListingReviews
} from '../controller/reviewController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()


/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a review for a completed booking
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookingId, rating]
 *             properties:
 *               bookingId:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.post('/', protect, createReview)

/**
 * @swagger
 * /reviews/listing/{listingId}:
 *   get:
 *     summary: Get all reviews for a listing, with pagination and rating filter
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
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
 *         name: rating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by exact star rating
 *     responses:
 *       200:
 *         description: List of reviews with pagination
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Server error
 */
router.get('/listing/:listingId', getListingReviews)


export default router