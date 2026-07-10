import request from 'supertest'
import app from '../server.js'


describe('Auth', () => {
    it('should register a new user', async () => {
      const res = await request(app)  
      .post('/api/auth/register')
      .send({
        name: 'Test User4',
        email: 'test4@example.com',
        password: 'password123',
        bio: 'Test bio4'
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
            email: 'test@example.com',
            password: 'password123'
        })
        expect(res.status).toBe(200)
        expect(res.body.message).toBe('Login Successful')
        expect(res.body.data).toHaveProperty('id')
        expect(res.body.data).toHaveProperty('createdAt')
        expect(res.body).toHaveProperty('token');
    })
})