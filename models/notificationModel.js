import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['NEW_BOOKING', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'BOOKING_COMPLETED', 'NEW_REVIEW'],
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    payload: {
        type: Schema.Types.Mixed
    }
}, {timestamps: true})

// schema file — index definition, no real values
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 })

const notificationModel = mongoose.model('Notification', notificationSchema);
export default notificationModel;