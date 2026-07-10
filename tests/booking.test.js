import request from "supertest";
import app from "../server.js";

let token
let bookingId

describe('Bookings', () => {
    beforeAll(async () => {
        //login and get token before tests run
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            })
        token = res.body.token
    })
    it('should create a new booking', async () => {
        const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
            listingId: '39e11a60-7a20-474b-baae-8ac253a9fd4d',
            scheduledAt: '2026-07-16T09:00:00.000Z'
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