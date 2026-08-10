import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../app.js";
import prisma from "../config/db.js";
import connectDB from "../config/mongodb.js";
import notificationModel from "../models/notificationModel.js";
import { cleanDb, cleanNotificationDB } from "../utils/cleanDatabase.js";

let token;
let userId;
let notificationId;

describe("Notifications", () => {
    beforeAll(async () => {
        await connectDB();
        const hashedPassword = await bcrypt.hash("password123", 10);

        const user = await prisma.user.create({
            data: {
                name: "Notif Test User",
                email: "notiftest@example.com",
                password: hashedPassword,
                // add any other required fields your User model needs
            }
        });
        userId = user.id;

        // Fabricate two notifications directly via Mongoose — one read, one unread
        await notificationModel.create({
            userId: user.id,
            type: "NEW_BOOKING",
            read: false,
            payload: { bookingId: "fake-id-1", listing_title: "Test Listing", seekerName: "Test Seeker" }
        });

        const secondNotif = await notificationModel.create({
            userId: user.id,
            type: "BOOKING_CONFIRMED",
            read: false,
            payload: { bookingId: "fake-id-2", listing_title: "Test Listing 2", seekerName: "Test Seeker 2" }
        });
        notificationId = secondNotif._id.toString();

        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "notiftest@example.com", password: "password123" });
        token = res.body.token;
    }, 30000);

    afterAll(async () => {
        await cleanDb();
        await cleanNotificationDB();
    });

    it("should fetch all notifications for the logged-in user", async () => {
        const res = await request(app)
            .get("/api/notifications")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(2);
    });

    it("should filter unread notifications only", async () => {
        const res = await request(app)
            .get("/api/notifications?read=false")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.data.every(n => n.read === false)).toBe(true);
    });

    it("should mark a notification as read", async () => {
        const res = await request(app)
            .patch(`/api/notifications/${notificationId}/read`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
    });

    it("should return 404 when marking a notification that doesn't belong to the user", async () => {
        const otherUser = await prisma.user.create({
            data: {
                name: "Other User",
                email: "otherguy@example.com",
                password: await bcrypt.hash("password123", 10),
            }
        });
        const otherLogin = await request(app)
            .post("/api/auth/login")
            .send({ email: "otherguy@example.com", password: "password123" });

        const res = await request(app)
            .patch(`/api/notifications/${notificationId}/read`)
            .set("Authorization", `Bearer ${otherLogin.body.token}`);
        expect(res.status).toBe(404);
    });

    it("should return 401 with no token", async () => {
        const res = await request(app).get("/api/notifications");
        expect(res.status).toBe(401);
    });
});