import Joi, { required } from 'joi';
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
        enum: ['USD', 'INR', 'EUR', 'GBP'],
        default: 'INR',
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

const isValidPlan = (plan: any) => {
    const schema = Joi.object({
        type: Joi.string().valid('free', 'basic', 'pro', 'premium').required(),
        discount: Joi.number().min(0).max(100),
        price: Joi.number().required(),
        description: Joi.string().required().max(1024).min(3),
        plan_name: Joi.string().required().max(64).min(3),
        request_limit: Joi.number().min(10000),
        currency: Joi.string().valid('USD', 'INR', 'EUR', 'GBP').required(),
        metadata: Joi.object(),

    })

    return schema.validate(plan);
}

const Plan = mongoose.model('Plans', plan_schema);

export default Plan;
export { isValidPlan };