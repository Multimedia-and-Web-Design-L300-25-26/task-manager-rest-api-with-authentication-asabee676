import request from 'supertest'
import app from '../src/app.js'
import User from '../src/models/User.js'
import Task from '../src/models/Task.js'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer
let token

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    process.env.MONGO_URI = mongoServer.getUri()
    await mongoose.connect(process.env.MONGO_URI)
})

afterAll(async () => {
    await mongoose.connection.close()
    await mongoServer.stop()
    // register and login
    await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password' })
    const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password' })
    token = res.body.token
})

describe('Tasks', () => {
    it('should create a task', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .auth(token, { type: 'bearer' })
            .send({ title: 'Test Task', description: 'Description' })
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('title', 'Test Task')
    })

    it('should get tasks', async () => {
        await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Test Task' })
        const res = await request(app)
            .get('/api/tasks')
            .auth(token, { type: 'bearer' })
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(1)
    })

    it('should delete a task', async () => {
        const createRes = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Test Task' })
        const res = await request(app)
            .delete(`/api/tasks/${createRes.body._id}`)
            .auth(token, { type: 'bearer' })
        expect(res.status).toBe(200)
    })

    it('should not delete task of another user', async () => {
        const createRes = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Test Task' })
        // Create another user
        await request(app)
            .post('/api/auth/register')
            .send({ email: 'other@example.com', password: 'password' })
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'other@example.com', password: 'password' })
        const otherToken = loginRes.body.token
        const res = await request(app)
            .delete(`/api/tasks/${createRes.body._id}`)
            .auth(otherToken, { type: 'bearer' })
        expect(res.status).toBe(404)
    })

    it('should require auth for tasks', async () => {
        const res = await request(app)
            .get('/api/tasks')
        expect(res.status).toBe(401)
    })
})