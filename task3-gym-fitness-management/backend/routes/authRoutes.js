import express from 'express';
import { registerUser, getUserProfile, updateUserProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', verifyToken, registerUser);
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, upload.single('profileImage'), updateUserProfile);

export default router;
