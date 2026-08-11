import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../app.js";
import prisma from "../config/db.js";
import connectDB from "../config/mongodb.js";
import { cleanDb, cleanNotificationDB } from "../utils/cleanDatabase.js";

let token
let listingId
let bookingId


describe('Bookings', () => {
    beforeAll(async () => {
        await connectDB();
        const hashedPassword = await bcrypt.hash("password123", 10)
        const provider = await prisma.user.create({
            data: {
                name: "Provider User",
                email: "provider@example.com",
                password: hashedPassword,
                role: 'ADMIN'
            }
        });

        const seeker = await prisma.user.create({
            data: {
                name: "Seeker User",
                email: "seeker@example.com",
                password: hashedPassword,
            }
        });

        const category = await prisma.category.create({
            data: {
                name: "Test Category",
                slug: "test-category"
            }
        });

        const listing = await prisma.skillListing.create({
            data: {
                title: "Python Programming Language for Automation etc",
                description: "I teach Python Programming Language for Automation, Data Analytics as well as AI and Machine Learning",
                price: 3000,
                userId: provider.id,
                categoryId: category.id
            }
        });
        listingId = listing.id

        //login and get token before tests run
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'seeker@example.com',
                password: 'password123'
            })
        token = res.body.token
    }, 30000)

    afterAll(async () => {
        await cleanDb();
        await cleanNotificationDB();
    });

    it('should create a new booking', async () => {
        const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
            listingId: listingId,
            scheduledAt: '2026-08-16T09:00:00.000Z'
        })
        expect(res.status).toBe(201)
        expect(res.body.data).toHaveProperty('seekerId')
        expect(res.body.data).toHaveProperty('scheduledAt')
        bookingId = res.body.data.id
        console.log(bookingId)
    })
    it('should confirm the booking with the specified ID', async () => {
        const res = await request(app)
        .patch(`/api/bookings/${bookingId}/confirm`)
        .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200)
        expect(res.body.data).toHaveProperty('status')
    })
})