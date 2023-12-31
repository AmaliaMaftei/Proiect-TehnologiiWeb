import express from 'express';
import * as userController from '../controllers/user.js'

export const router = express.Router();

router.get('/', userController.getUsers);
router.get('/:id', userController.getById);

router.post('/', userController.addUser);
