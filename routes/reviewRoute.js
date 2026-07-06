import express from 'express'
import {
    createReview, getListingReviews
} from '../controller/reviewController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', protect, createReview)
router.get('/listing/:listingId', getListingReviews)


export default router