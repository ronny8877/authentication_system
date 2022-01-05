import mongoose, { Schema } from 'mongoose';
import { AppDb } from '../interfaces/app_db';


const app_db_schema = new Schema({
    app_name: {
        type: String,
        required: true,
        maxlength: 64,
        minlength: 3,
        unique: true,
    }
    ,
    created_at: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Users',
        required: true,
    },
    is_active: {
        type: Boolean,
        default: true

    }
    ,
    active_plan: {
        plan_id: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Plans',
            required: true,

        },
        created_at: {
            type: Date,
            default: Date.now
        }



})

