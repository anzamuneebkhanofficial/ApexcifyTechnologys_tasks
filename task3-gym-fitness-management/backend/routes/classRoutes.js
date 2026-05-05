import express from 'express';
import { getClasses, createClass, enrollClass, updateClass, deleteClass } from '../controllers/classController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getClasses);
router.post('/', verifyToken, authorizeRoles('Admin', 'Trainer'), createClass);
router.put('/:id', verifyToken, authorizeRoles('Admin', 'Trainer'), updateClass);
router.delete('/:id', verifyToken, authorizeRoles('Admin', 'Trainer'), deleteClass);
router.post('/:id/enroll', verifyToken, authorizeRoles('Member'), enrollClass);

export default router;
