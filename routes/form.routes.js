import express from 'express';
import auth from '../middlewares/Auth.js';
import { createForm, getForm, getMyForms, publishForm, submitForm, toggleForm, updateForm } from '../controllers/form.controllers.js';
import multer from 'multer';
const upload = multer();

const router = express.Router();

// Authenticated: Create a new form
router.post('/', auth, createForm);

// Authenticated: Get all forms created by the user
router.get('/myforms', auth, getMyForms);

// Public: Get form by ID
router.get('/:id', getForm);

// Dependent: Submit form response
router.post('/:id/submit', upload.none(), submitForm);

router.post('/:id/update', auth, updateForm);

router.post('/:id/publish', auth, publishForm);

router.post('/:id/toggle', auth, toggleForm);

export default router;
