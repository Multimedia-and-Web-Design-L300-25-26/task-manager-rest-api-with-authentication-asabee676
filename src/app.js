import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error(err))

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

export default app