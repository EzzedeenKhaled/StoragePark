import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    details: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ['customer', 'partner', 'admin'],
        required: true,
    },
}, {
    timestamps: true
});

const Log = mongoose.model("Log", logSchema);
export default Log;