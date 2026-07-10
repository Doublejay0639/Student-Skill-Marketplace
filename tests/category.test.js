import request from 'supertest';
import app from '../server.js'

let token

describe('Category', () => {
    beforeAll(async () => {
        const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'tayo@example.com',
            password: 'password123'
        })
        token = res.body.token
    })
    it('should create a new category', async () => {
        const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'Test2 Category',
            slug: 'test2-category'
        })
        expect(res.status).toBe(201)
        expect(res.body.data).toHaveProperty('name')
        expect(res.body.data).toHaveProperty('slug')
    })
    it('should return all categories as well as each of the listings', async () => {
        const res = await request(app)
        .get('/api/categories')
        expect(res.status).toBe(200)
        expect(res.body.data.length).toBeGreaterThan(0)
        expect(Array.isArray(res.body.data)).toBe(true)
    })
})