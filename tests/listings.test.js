import request from 'supertest'
import app from '../app.js'
import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import { cleanDb } from "../utils/cleanDatabase.js";


let token
let listingId
let categoryId

describe('Listings', () => {
    beforeAll(async () => {
        const hashedPassword = await bcrypt.hash("password123", 10)

        const provider = await prisma.user.create({
            data: {
                name: "Provider User",
                email: "provider@example.com",
                password: hashedPassword
            }
        })

        const category = await prisma.category.create({
            data: {
                name: "Test Category",
                slug: "test-category",
            }
        })
        categoryId = category.id

        //login and get token before tests run
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'provider@example.com',
                password: 'password123'
            })
        token = res.body.token
    })
    it('should create a listing under an existing category', async () => {
        const res = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'Test Title',
            description: 'Test Description for a student skil marketplace platform with automated testing using Jest and Supertest.',
            price: 1000,
            categoryId: categoryId
        })
        expect(res.status).toBe(201)
        expect(res.body.data).toHaveProperty('title')
        expect(res.body.data).toHaveProperty('price')
        expect(res.body.data).toHaveProperty('userId')
        listingId = res.body.data.id
    })
    it('should return all listings that are available as well as the user who created it and the categories', async () => {
        const res = await request(app)
        .get('/api/listings')
        expect(res.status).toBe(200)
        expect(res.body.data.length).toBeGreaterThan(0)
        expect(Array.isArray(res.body.data)).toBe(true)
    })
    it('should return the listing with the specified ID as well as the user who created it and its category', async () => {
        const res = await request(app)
        .get(`/api/listings/${listingId}`)
        expect(res.status).toBe(200)
        expect(res.body.data).toHaveProperty('title')
        expect(res.body.data).toHaveProperty('available')
        expect(res.body.data).toHaveProperty('categoryId')
        expect(res.body.data.user).toHaveProperty('id')
        expect(res.body.data.category).toHaveProperty('name')
    })
    afterAll(async () => {
        await cleanDb();
    })
})