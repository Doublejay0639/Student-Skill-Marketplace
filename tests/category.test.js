import request from 'supertest';
import app from '../app.js'
import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import { cleanDb, cleanNotificationDB } from "../utils/cleanDatabase.js";


let token

describe('Category', () => {
    beforeAll(async () => {
        const hashedPassword = await bcrypt.hash("password123", 10)
        const admin = await prisma.user.create({
            data: {
                name: "Admin User",
                email: "admin@example.com",
                password: hashedPassword,
                role: 'ADMIN'
            }
        });

        const user = await prisma.user.create({
            data: {
                name: "Test User",
                email: "user@example.com",
                password: hashedPassword,
                role: 'STUDENT'
            }
        });

        const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'admin@example.com',
            password: 'password123'
        })
        token = res.body.token
    }, 30000)

    afterAll(async () => {
        await cleanDb();
    })

    it('should create a new category', async () => {
        const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'Test Category',
            slug: 'test-category'
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
    it('should return 403 when a non-admin tries to create a category', async () => {
        const otherLogin = await request(app)
        .post("/api/auth/login")
        .send({ email: "user@example.com", password: "password123" });

        const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${otherLogin.body.token}`)
        .send({
            name: 'Test2 Category',
            slug: 'test2-category'
        })
        expect(res.status).toBe(403);
    })
})