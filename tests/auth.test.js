import request from 'supertest'
import app from '../app.js'
import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import { cleanDb} from "../utils/cleanDatabase.js";


describe('Auth', () => {
    beforeAll(async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const loginUser = await prisma.user.create({
        data: {
          name: "Login User",
          email: "loginuser@example.com",
          password: hashedPassword
        }
      })
    })
    afterAll(async () => {
      await cleanDb();
    })
    it('should register a new user', async () => {
      const res = await request(app)  
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        bio: 'Test bio'
      })
    expect(res.status).toBe(201)
    expect(res.body.message).toBe('Account created successfully')
    expect(res.body.data).toHaveProperty('id')
    expect(res.body.data).not.toHaveProperty('password')
    })

    it('should login an existing user and return a token', async () => {
        const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'loginuser@example.com',
            password: 'password123'
        })
        expect(res.status).toBe(200)
        expect(res.body.message).toBe('Login Successful')
        expect(res.body.data).toHaveProperty('id')
        expect(res.body.data).toHaveProperty('createdAt')
        expect(res.body).toHaveProperty('token');
    })
})