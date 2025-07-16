import express from 'express';
import { getFormResponses } from '../controllers/resp.controllers.js';
import auth from '../middlewares/Auth.js';

const router = express.Router();

// Get responses of a form
router.get('/:id', auth, getFormResponses);

export default router;