import request from 'supertest';
import bcrypt from "bcryptjs";
import prisma from '../config/db.js';
import connectDB from '../config/mongodb.js';
import app from '../app.js'
import { cleanDb, cleanNotificationDB } from "../utils/cleanDatabase.js";


let token
let categoryId
let listingId
let bookingId

describe('Reviews', () => {
    beforeAll(async () => {
        await connectDB();
        const hashedPassword = await bcrypt.hash("password123", 10)
        const provider = await prisma.user.create({
            data: {
                name: "Provider User",
                email: "provider@example.com",
                password: hashedPassword,
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
                slug: "test-category",
            }
        })
        categoryId = category.id

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

        const booking = await prisma.booking.create({
            data: {
                scheduledAt: '2026-08-16T09:00:00.000Z',
                listingId: listing.id,
                seekerId: seeker.id
            }
        })

        const completedBooking = await prisma.booking.update({
            where: { id: booking.id },
            data: {
                status: 'COMPLETED'
            }
        })
        bookingId = completedBooking.id


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
    }, 30000)

    it('should create a review for a booking', async () => {
        const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({
            rating: 4,
            comment: 'Loved the delivery. I recommend',
            bookingId: bookingId
        })
        expect(res.status).toBe(201)
        expect(res.body.data).toHaveProperty('rating')
        expect(res.body.data).toHaveProperty('bookingId')
    })
    it('should return the reviews for a particular specified listing', async () => {
        const res = await request(app)
        .get(`/api/reviews/listing/${listingId}`)
        expect(res.status).toBe(200)
        expect(res.body.data.length).toBeGreaterThan(0)
        expect(Array.isArray(res.body.data)).toBe(true)
    })
    it('should return 400 when another user tries to review a separate booking from his own', async () => {
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
        .post('/api/reviews')
        .set('Authorization', `Bearer ${otherLogin.body.token}`)
        .send({
            rating: 5,
            comment: 'Very Nice',
            bookingId: bookingId
        })
        expect(res.status).toBe(400);
    })
    
})