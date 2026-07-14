import { z } from 'zod'
import {
    createReview as createReviewService, getListingReviews as getListingReviewsService
} from '../services/reviewService.js'


const reviewSchema = z.object({
    rating: z.number().int().min(1, "Enter a number between 1 and 5").max(5, "Enter a number between 1 and 5"),
    comment: z.string().optional(),
    bookingId: z.string()
})

export const createReview = async (req, res) => {
    try {
        console.log('Request body:', req.body)
        const reviewDetails = reviewSchema.parse(req.body)
        const reviewerId = req.user.id
        const newReview = await createReviewService({...reviewDetails, reviewerId})
        return res.status(201).json({
            message: 'Review added',
            data: newReview
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Failed to add review',
                errors: error.errors
            })
        } else if (error.message === "Booking not found") {
            return res.status(400).json({
                message: 'Booking not found',
                error: error.message
            })
        } else if (error.message === "Can't review an uncompleted booking") {
            return res.status(400).json({
                message: 'Complete booking before review',
                error: error.message
            })
        } else if (error.message === "Can only review your own booking") {
            return res.status(400).json({
                message: 'Review your own completed bookings only',
                error: error.message
            })
        } else {
            return res.status(500).json({
                message: 'Server error',
                error: error.message
            })
        }
    }
}

export const getListingReviews = async (req, res) => {
    try {
        const { listingId } = req.params
        const { page, limit, rating } = req.query
        const [reviews, total] = await getListingReviewsService(listingId, { page, limit, rating })
        const totalPages = Math.ceil(total / (parseInt(limit) || 10))
        return res.status(200).json({
            message: "Reviews fetched successfully",
            data: reviews,
            pagination: { total, page, limit, totalPages}
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}