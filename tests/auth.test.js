import request from 'supertest'
import app from '../src/app.js'
import User from '../src/models/User.js'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import jwt from 'jsonwebtoken'

let mongoServer

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    process.env.MONGO_URI = mongoServer.getUri()
    await mongoose.connect(process.env.MONGO_URI)
})

afterAll(async () => {
    await mongoose.connection.close()
    await mongoServer.stop()
})

describe('Auth', () => {
    it('should register a user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password' })
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('email', 'test@example.com')
    })

    it('should not register with duplicate email', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password' })
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password2' })
        expect(res.status).toBe(400)
    })

    it('should login a user', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password' })
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password' })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('token')
        const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET)
        expect(decoded).toHaveProperty('id')
    })
})