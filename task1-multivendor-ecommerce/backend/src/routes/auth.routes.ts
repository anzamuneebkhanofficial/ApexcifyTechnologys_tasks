import express from 'express';
import { authUser, registerUser, getUserProfile, getUsers } from '../controllers/auth.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.get('/', protect, admin, getUsers);

export default router;
