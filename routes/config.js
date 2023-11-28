import express from 'express';
import { router as userRouter } from './user.js'

export const router = express.Router();

router.use('/user', userRouter);
