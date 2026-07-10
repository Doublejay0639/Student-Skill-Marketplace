import request from 'supertest';
import app from '../server.js'

let token


describe('Reviews', () => {
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
    it.skip('should create a review for a booking', async () => {
        const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${token}`)
        .send({
            rating: 4,
            comment: 'Loved the delivery. I recommend',
            bookingId: "d9d1594f-6345-43f2-9f8f-866b34fd8c65"
        })
        expect(res.status).toBe(201)
        expect(res.body.data).toHaveProperty('rating')
        expect(res.body.data).toHaveProperty('bookingId')
    })
    it('should return the reviews for a particular specified listing', async () => {
        const res = await request(app)
        .get(`/api/reviews/listing/39e11a60-7a20-474b-baae-8ac253a9fd4d`)
        expect(res.status).toBe(200)
        expect(res.body.data.length).toBeGreaterThan(0)
        expect(Array.isArray(res.body.data)).toBe(true)
    })
})