import { z } from "zod"
import { createBooking as createBookingService, getMyBookings as getMyBookingsService, confirmBooking as confirmBookingService, cancelBooking as cancelBookingService, completeBooking as completeBookingService

} from "../services/bookingService.js";

const createSchema = z.object({
    listingId: z.string(),
    scheduledAt: z.string()
})

export const createBooking = async(req, res) => {
    try {
        const bookingDetails = createSchema.parse(req.body)
        const seekerId = req.user.id
        const newBooking = await createBookingService({...bookingDetails, seekerId})
        return res.status(201).json({
            message: "Successfully booked listing",
            data: newBooking
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Failed to book listing',
                errors: error.errors
            })
        } else if (error.message === "Listing doesn't exist") {
            return res.status(404).json({
                message: "Listing doesn't exist",
                error: error.message
            })
        } else if(error.message === "Can't book your own listing") {
            return res.status(400).json({
                message: "Can't book your own listing",
                error: error.message
            })
        } else if(error.message === "Existing booking still pending") {
            return res.status(400).json({
                message: "Existing booking still pending",
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

export const getMyBookings = async (req, res) => {
    try {
        const seekerId = req.user.id
        const allBookings = await getMyBookingsService(seekerId)
        return res.status(200).json({
            message: "All bookings:",
            data: allBookings
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        })
    }
}

export const confirmBooking = async (req, res) => {
    try {
        const { id } = req.params
        const confirmed = await confirmBookingService(id)
        return res.status(200).json({
            message: "booking confirmed",
            data: confirmed
        })
    } catch (error) {
        if (error.message === "Booking doesn't exist") {
            return res.status(404).json({
                message: "Booking doesn't exist"
            })
        } else {
            return res.status(500).json({
                message: 'Server error',
                error: error.message
            })
        }
    }
}


export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params
        const cancelled = await cancelBookingService(id)
        return res.status(200).json({
            message: "booking cancelled!!",
            data: cancelled
        })
    } catch (error) {
        if (error.message === "Booking doesn't exist") {
            return res.status(404).json({
                message: "Booking doesn't exist"
            })
        } else {
            return res.status(500).json({
                message: 'Server error',
                error: error.message
            })
        }
    }
}


export const completeBooking = async (req, res) => {
    try {
        const { id } = req.params
        const completed = await completeBookingService(id)
        return res.status(200).json({
            message: "booking completed",
            data: completed
        })
    } catch (error) {
        if (error.message === "Booking doesn't exist") {
            return res.status(404).json({
                message: "Booking doesn't exist"
            })
        } else {
            return res.status(500).json({
                message: 'Server error',
                error: error.message
            })
        }
    }
}