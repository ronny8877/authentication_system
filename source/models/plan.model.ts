import mongoose, { Schema } from 'mongoose';

const plan_schema = new Schema({
    type: {
        type: String,
        enum: ['free', 'basic', 'pro', 'premium'],
        default: 'free'
    },
    discount: {
        type: Number,
        default: 0

    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    duration: {
        type: Date,
        required: true,
        //default duration is 30 days
        //refreshes every 30 days
        default: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))
    },
    request_limit: {
        //monthly request limit
        type: Number,
        default: 10000
    },

    currency: {
        type: String,
        required: true,
    },

    plan_name: {
        type: String,
        required: true,
        maxlength: 64,
        minlength: 3,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 1024,
        minlength: 3,
    },
    metadata: {
        type: Object,
        default: {}
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Users',
        required: true,
    },
})


const Plan = mongoose.model('Plans', plan_schema);

export default Plan;