// import mongoose from 'mongoose'
import prisma from '../config/db.js'
import notificationModel from '../models/notificationModel.js'


export const cleanDb = async () => {
    await prisma.review.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.skillListing.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
}

export const cleanNotificationDB = async () => {
    await notificationModel.deleteMany({})
}