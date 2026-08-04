import { getMyNotifications, markAsRead as markAsReadService } from "../services/notificationService.js";


export const fetchNotifications = async (req, res) => {
    try {
        const {id: userId} = req.user
        const { page, limit, read } = req.query
        const [notifications, totalNotifications] = await getMyNotifications(userId, {page, limit, read})

        const totalPages = Math.ceil(totalNotifications / (parseInt(limit) || 10))

        return res.status(200).json({
            data: notifications,
            pagination: {
                totalNotifications, page, limit, totalPages
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        })
    }
}


export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params
        const {id: userId} = req.user
        const readNotification = await markAsReadService(id, userId)
        return res.status(200).json({
            message: "Marked as read",
        })
    } catch (error) {
        if (error.message === "Can only mark your own notification") {
            return res.status(404).json({
                message: "Notification not found",
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