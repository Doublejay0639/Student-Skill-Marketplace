import notificationModel from '../models/notificationModel.js'


export const createNotification = async ({ userId, type, payload }) => {
    const notification = await notificationModel.create({
        userId,
        type,
        payload
    })

    return notification
}