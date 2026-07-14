import 'dotenv/config'
import prisma from '../config/db.js'


export const createReview = async ({rating, comment, bookingId, reviewerId}) => {
    const booking = await prisma.booking.findUnique({
        where: {id: bookingId}
    })

    if (!booking) {
        throw new Error("Booking not found")
    }

    if (booking.status !== 'COMPLETED') {
        throw new Error("Can't review an uncompleted booking")
    }

    if (reviewerId !== booking.seekerId) {
        throw new Error("Can only review your own booking")
    }

    const existingReview = await prisma.review.findUnique({
        where: {
            bookingId
        }
    })

    if (existingReview) {
        throw new Error("Review already exists for this booking")
    }
    

    const review = await prisma.review.create({
        data: {
            bookingId,
            reviewerId,
            rating,
            comment
        }
    })

    return review
}


export const getListingReviews = async (listingId, {page, limit, rating}) => {
    const pageNum = parseInt(page) || 1
    const limitNum = parseInt(limit) || 10
    const where = {
        booking: {
            listingId
        },
        ...(rating && {rating: parseInt(rating)}),
    }
    const reviews = await prisma.review.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
            reviewer: {
                select: {name: true}
            }
        }
    })
    const total = await prisma.review.count({
        where
    })
    return [reviews, total]
}