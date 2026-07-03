import 'dotenv/config'
import prisma from "../config/db.js"


export const createBooking = async ({ listingId, scheduledAt, seekerId }) => {
    const listing = await prisma.skillListing.findUnique({
        where: { id: listingId}
    })

    if(!listing) {
        throw new Error("Listing doesn't exist")
    }

    if(listing.userId === seekerId) {
        throw new Error("Can't book your own listing")
    }

    const existingBooking = await prisma.booking.findFirst({
        where: {
            listingId,
            seekerId,
            status: 'PENDING'
        }
    })

    if (existingBooking) {
        throw new Error("Existing booking still pending")
    }

    const newBooking = await prisma.booking.create({
        data: {
            scheduledAt,
            listingId,
            seekerId
        }
    })

    return newBooking
}


export const getMyBookings = async (seekerId) => {
    const bookings = await prisma.booking.findMany({
        where: { seekerId },
        include: {
            listing: {
                select: {id: true, title: true, description: true, price: true}
            }
        }
    })
    return bookings
}


export const confirmBooking = async (id) => {
    const booking = await prisma.booking.findUnique({
        where: {id}
    })

    if (!booking) {
        throw new Error("Booking doesn't exist")
    }

    const updatedBooking = await prisma.booking.update({
        where: { id },
        data: {
            status: 'CONFIRMED'
        }
    })
    return updatedBooking
}


export const cancelBooking = async (id) => {
    const booking = await prisma.booking.findUnique({
        where: {id}
    })

    if (!booking) {
        throw new Error("Booking doesn't exist")
    }

    const cancelledBooking = await prisma.booking.update({
        where: { id },
        data: {
            status: 'CANCELLED'
        }
    })
    return cancelledBooking
}


export const completeBooking = async (id) => {
    const booking = await prisma.booking.findUnique({
        where: {id}
    })

    if (!booking) {
        throw new Error("Booking doesn't exist")
    }

    const completedBooking = await prisma.booking.update({
        where: { id },
        data: {
            status: 'COMPLETED'
        }
    })
    return completedBooking
}