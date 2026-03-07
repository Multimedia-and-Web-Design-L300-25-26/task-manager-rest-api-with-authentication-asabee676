import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ message: 'No token provided' })
    return res.status(200).json({ token })
}