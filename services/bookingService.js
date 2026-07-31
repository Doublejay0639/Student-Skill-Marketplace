import 'dotenv/config'
import prisma from "../config/db.js"
import { createNotification } from './notificationService.js'


export const createBooking = async ({ listingId, scheduledAt, seekerId }) => {
    const listing = await prisma.skillListing.findUnique({
        where: { id: listingId }
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
        },
        include: {
            listing: {
                select: {
                    title: true,
                    userId: true
                }
            },
            seeker: {
                select: {
                    name: true
                }
            }
        }
    })

    try {
        await createNotification({userId: newBooking.listing.userId, type: 'NEW_BOOKING', payload: {bookingId: newBooking.id, listing_title: newBooking.listing.title, seekerName: newBooking.seeker.name}})
    } catch (error) {
        console.error('Notification failed: ', error)
    }

    return newBooking
}


export const getMyBookings = async (seekerId, {page, limit, status}) => {
    const pageNum = parseInt(page) || 1
    const limitNum = parseInt(limit) || 10
    const where = {
        seekerId ,
        ...(status && { status })
    }
    const bookings = await prisma.booking.findMany({
        // where: { seekerId },
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
            listing: {
                select: {id: true, title: true, description: true, price: true}
            }
        }
    })
    const total = await prisma.booking.count({
        where
    })
    return [bookings, total]
}

export const confirmBooking = async (id) => {
    let updatedBooking;
    try {
        updatedBooking = await prisma.booking.update({
            where: { id },
            data: {
                status: 'CONFIRMED'
            },
            include: {
                listing: {
                    select: {
                        title: true,
                    }
                },
                seeker: {
                    select: {
                        name: true
                    }
                }
            }
        })
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error("Booking doesn't exist")    
        }
        throw error
    }

    try {
        await createNotification({userId: updatedBooking.seekerId, type: 'BOOKING_CONFIRMED', payload: {bookingId: updatedBooking.id, listing_title: updatedBooking.listing.title, seekerName: updatedBooking.seeker.name}})
    } catch (error) {
        console.error('Notification failed: ', error)
    }
    return updatedBooking;
}


export const cancelBooking = async (id) => {
    let cancelledBooking;
    try {
        cancelledBooking = await prisma.booking.update({
            where: { id },
            data: {
                status: 'CANCELLED'
            },
            include: {
                listing: {
                    select: {
                        title: true,
                    }
                },
                seeker: {
                    select: {
                        name: true
                    }
                }
            }
        })
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error("Booking doesn't exist")    
        }
        throw error
    }

    try {
        await createNotification({userId: cancelledBooking.seekerId, type: 'BOOKING_CANCELLED', payload: {bookingId: cancelledBooking.id, listing_title: cancelledBooking.listing.title, seekerName: cancelledBooking.seeker.name}})
    } catch (error) {
        console.error('Notification failed: ', error)
    }
    return cancelledBooking;
}


export const completeBooking = async (id) => {
    let completedBooking;
    try {
        completedBooking = await prisma.booking.update({
            where: { id },
            data: {
                status: 'COMPLETED'
            },
            include: {
                listing: {
                    select: {
                        title: true,
                    }
                },
                seeker: {
                    select: {
                        name: true
                    }
                }
            }
        })
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error("Booking doesn't exist")    
        }
        throw error
    }

    try {
        await createNotification({userId: completedBooking.seekerId, type: 'BOOKING_COMPLETED', payload: {bookingId: completedBooking.id, listing_title: completedBooking.listing.title, seekerName: completedBooking.seeker.name}})
    } catch (error) {
        console.error('Notification failed: ', error)
    }
    return completedBooking;
}