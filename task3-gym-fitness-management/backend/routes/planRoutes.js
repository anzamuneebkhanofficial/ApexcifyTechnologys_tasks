import express from 'express';
import { getMyPlans, getAllPlans, createPlan, updatePlan, deletePlan } from '../controllers/planController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getMyPlans);
router.get('/all', verifyToken, authorizeRoles('Admin', 'Trainer'), getAllPlans);
router.post('/', verifyToken, authorizeRoles('Admin', 'Trainer'), upload.single('planFile'), createPlan);
router.put('/:id', verifyToken, authorizeRoles('Admin', 'Trainer'), upload.single('planFile'), updatePlan);
router.delete('/:id', verifyToken, authorizeRoles('Admin', 'Trainer'), deletePlan);

export default router;
