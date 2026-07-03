import express from 'express'
import { createBooking, getMyBookings, confirmBooking,
    cancelBooking, completeBooking
} from "../controller/bookingController.js";
import { protect } from '../middlewares/authMiddleware.js';


const router = express.Router()

router.post('/', protect, createBooking)
router.get('/', protect, getMyBookings)
router.patch('/:id/confirm', protect, confirmBooking)
router.patch('/:id/cancel', protect, cancelBooking)
router.patch('/:id/complete', protect, completeBooking)


export default router