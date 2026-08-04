import express from "express";
import { fetchNotifications, markAsRead } from "../controller/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";


const router = express.Router()


/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications for the logged-in user
 *     tags: [Notifications]
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
 *         name: read
 *         schema:
 *           type: boolean
 *         description: Filter by notifications by read/unread
 *     responses:
 *       200:
 *         description: List of all notfications with pagination
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', protect, fetchNotifications)



/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: read a notification
 *     tags: [Notifications]
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
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/read', protect, markAsRead)


export default router