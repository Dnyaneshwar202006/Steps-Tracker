import express from 'express'
import { authenticate } from '../middleware/auth.middlewares';
import { getSteps, getTheHistory, saveStep } from '../controllers/steps.controller';

const router = express.Router();

router.post("/", authenticate, saveStep);
router.get("/steps", authenticate, getSteps)
router.get("/history", authenticate, getTheHistory)

export default router;