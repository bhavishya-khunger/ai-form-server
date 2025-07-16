import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
        required: true
    },
    answers: Object, // Accepts any JSON-like object
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});


const Response = mongoose.model('Response', responseSchema);

export default Response;