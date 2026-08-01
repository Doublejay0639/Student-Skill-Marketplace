import mongoose from 'mongoose'
import notificationModel from '../models/notificationModel.js'


export const createNotification = async ({ userId, type, payload }) => {
    const notification = await notificationModel.create({
        userId,
        type,
        payload
    })

    return notification
}

export const getMyNotifications = async (userId, {page, limit, read}) => {
    const pageNum = parseInt(page) || 1
    const limitNum = parseInt(limit) || 10
    const skipValue = (pageNum - 1) * limitNum

    const filter = { userId , ...(read !== undefined && { read: read === 'true' })};

    const notifications = await notificationModel.find(filter)
    .sort({createdAt: -1})
    .skip(skipValue)
    .limit(limitNum)

    const totalCount = await notificationModel.countDocuments(filter)

    return [notifications, totalCount]
}


export const markAsRead = async (notificationId, userId) => {
    const filter = { _id: notificationId,
        userId: userId
     };
    const update = {
        read: true
    };
    const options = {
        new: true,
        runValidators: true
    };

    const readNotification = await notificationModel.findOneAndUpdate(filter, update, options);

    if (!readNotification) {
        throw new Error("Can only mark your own notification")   
    }

    return readNotification
}