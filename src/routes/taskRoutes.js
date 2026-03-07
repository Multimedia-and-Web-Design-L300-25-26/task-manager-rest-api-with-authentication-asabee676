import express from 'express'
import { createTask, getTasks, deleteTask } from '../controllers/taskController.js'
import { auth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(auth)

router.post('/', createTask)
router.get('/', getTasks)
router.delete('/:id', deleteTask)

export default router