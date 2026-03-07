import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const register = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = new User({ email, password })
        await user.save()
        res.status(201).json({ id: user._id, email: user.email })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' })
        }
        res.status(500).json({ message: 'Server error' })
    }
}

export const login = async (req, res) => {
    res.json({ token: 'test' })
}