import Form from '../models/form.model.js';
import Response from '../models/responses.model.js';
import { configDotenv } from 'dotenv';
configDotenv();
import jwt from 'jsonwebtoken';

const FRONTEND_URI = process.env.FRONTEND_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Create a form
export const createForm = async (req, res) => {
  try {
    const form = new Form({ ...req.body, createdBy: req.user.userId });
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all forms
export const getMyForms = async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.user.userId });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get form by ID
export const getForm = async (req, res) => {
  try {
    const id = req.params.id;
    const form = await Form.findById(id);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.json({ form, formLink: `${FRONTEND_URI}/forms/view/${id}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit form by ID
export const submitForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Check for auth if required
    if (form.authReq) {
      const token = req.header('Authorization').replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Login is required to submit this form.' });
      }
      console.log(token, JWT_SECRET);
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log(decoded);

    }

    // Parse answers from req.body (sent as JSON string)
    let parsedAnswers;
    try {
      parsedAnswers = JSON.parse(req.body.answers);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid answers format' });
    }

    // Create and save the response
    const response = new Response({
      formId: form._id,
      answers: parsedAnswers,
      submittedBy: req.user?.userId || null
    });

    await response.save();

    res.status(200).json({
      message: 'Form submitted successfully!',
      response
    });

  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update form code
export const updateForm = async (req, res) => {
  try {
    const formId = req.params.id;
    const updates = req.body;
    const form = await Form.findOneAndUpdate(
      { _id: formId, createdBy: req.user.userId }, updates.formData, { new: true }
    );
    console.log("form updated: ", updates);
    await form.save();
    if (!form) {
      return res.status(404).json({ error: 'Form not found or unauthorized' });
    }
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const publishForm = async (req, res) => {
  try {
    const formId = req.params.id;
    const form = await Form.findOne({ _id: formId, createdBy: req.user.userId });
    if (!form) {
      return res.status(404).json({ error: 'Form not found or unauthorized' });
    }
    form.isEditable = false;
    form.accepting = true;
    await form.save();
    res.json({ message: 'Form published successfully', form });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleForm = async (req, res) => {
  try {
    const formId = req.params.id;
    const form = await Form.findOne({ _id: formId, createdBy: req.user.userId });
    if (!form) {
      return res.status(404).json({ error: 'Form not found or unauthorized' });
    }
    if (form.isEditable) return res.status(404).json({error: 'Cannot be turned on until the form is not published.'});
    const pvs = form.accepting;
    form.accepting = !pvs;
    await form.save();
    res.json({ message: `Form ${pvs ? 'Closed' : 'Opened'} successfully`, form });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
}