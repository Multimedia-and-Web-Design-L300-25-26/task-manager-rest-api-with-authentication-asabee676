import Task from '../models/Task.js'

export const createTask = async (req, res) => {
    try {
        const task = new Task({ ...req.body, user: req.user.id })
        await task.save()
        res.status(201).json(task)
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id })
        res.json(tasks)
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id })
        if (!task) return res.status(404).json({ message: 'Task not found' })
        res.json({ message: 'Task deleted' })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
}