import express from 'express'
import { createBooking, getMyBookings, confirmBooking,
    cancelBooking, completeBooking
} from "../controller/bookingController.js";
import { protect } from '../middlewares/authMiddleware.js';


const router = express.Router()

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking for a listing
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [listingId]
 *             properties:
 *               listingId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Server error
 */
router.post('/', protect, createBooking)

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings for the logged-in seeker
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, COMPLETED, CANCELLED]
 *         description: Filter by booking status
 *     responses:
 *       200:
 *         description: List of bookings with pagination
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', protect, getMyBookings)

/**
 * @swagger
 * /bookings/{id}/confirm:
 *   patch:
 *     summary: Confirm a pending booking
 *     tags: [Bookings]
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
 *         description: Booking confirmed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/confirm', protect, confirmBooking)

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel a booking
 *     tags: [Bookings]
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
 *         description: Booking cancelled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/cancel', protect, cancelBooking)

/**
 * @swagger
 * /bookings/{id}/complete:
 *   patch:
 *     summary: Mark a booking as completed
 *     tags: [Bookings]
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
 *         description: Booking completed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/complete', protect, completeBooking)


export default router