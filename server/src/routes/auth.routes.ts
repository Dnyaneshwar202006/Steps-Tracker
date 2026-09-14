import express from 'express'
import { register } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middlewares';
import { registerValidator } from '../validators/auth.validator';

const router = express.Router();

router.post("/register", registerValidator, validate, register);

export default router;