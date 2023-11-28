import express from 'express';
import { router as userRouter } from './user.js'
import { router as taskRouter } from './task.js'

export const router = express.Router();

router.use('/user', userRouter);
router.use('/task', taskRouter);
