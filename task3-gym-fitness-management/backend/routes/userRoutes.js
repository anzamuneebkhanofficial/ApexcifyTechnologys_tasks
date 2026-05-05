import express from 'express';
import { getMembers, getTrainers, updateUser, deleteUser } from '../controllers/userController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/members', verifyToken, authorizeRoles('Admin', 'Trainer'), getMembers);
router.get('/trainers', verifyToken, authorizeRoles('Admin'), getTrainers);
router.put('/:id', verifyToken, authorizeRoles('Admin'), updateUser);
router.delete('/:id', verifyToken, authorizeRoles('Admin'), deleteUser);

export default router;
