import Response from '../models/responses.model.js';
import Form from '../models/form.model.js';
import mongoose from 'mongoose';

export const getFormResponses = async (req, res) => {
    try {
        const { id: formId } = req.params;
        const userId = req.user.userId; // Assuming user ID is available from auth middleware
        // Validate formId
        if (!mongoose.Types.ObjectId.isValid(formId)) {
            return res.status(400).json({ error: 'Invalid form ID' });
        }

        // First verify the form exists and belongs to the requesting user
        const form = await Form.findOne({ 
            _id: formId, 
            createdBy: userId 
        });

        console.log("form: ", form);

        if (!form) {
            return res.status(404).json({ 
                error: 'Form not found or you do not have permission to access these responses' 
            });
        }

        // Get all responses for this form
        const responses = await Response.find(
            { formId }
        );

        // Return the responses
        res.status(200).json(responses.map(r => ({
            responseId: r._id,
            answers: r.answers,
            submittedAt: r.submittedAt
        })));

    } catch (error) {
        console.error('Error fetching form responses:', error);
        res.status(500).json({ error: 'Server error while fetching responses' });
    }
};