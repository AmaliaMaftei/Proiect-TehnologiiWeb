import express from 'express';
import * as taskController from '../controllers/task.js'

export const router = express.Router();

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getById);

router.post('/', taskController.addTask);

router.patch('/:id/update', taskController.updateTask);
