import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  title: {type: String, required: true},
  fields: [Object],
  description: String,
  isEditable: {type: Boolean, default: true},
  accepting: {type: Boolean, default: false},
  authReq : {type: Boolean, default: false},
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Form', formSchema);
