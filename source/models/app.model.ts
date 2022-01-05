import { date } from 'joi';
import mongoose, { Schema } from 'mongoose';
import AppInterface from '../interfaces/apps';
import { AppDb } from '../interfaces/app_db';
import { v4 as uuidv4 } from 'uuid';

const app_schema = new Schema({
    app_name: {
        type: String,
        required: true,
        maxlength: 64,
        minlength: 3,
        unique: true,
    }
    , token: {
        type: String, unique: true,
        default: uuidv4
    },

    alias: {
        type: String,
        maxlength: 64,
        minlength: 3,

    },
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
        },
        updated_at: {
            type: Date
            , default: Date.now
        },
        status: {
            type: String,
            enum: ['free', 'active', 'expired', 'cancelled', 'suspended', 'renewed'],
            default: 'free'
        },
        duration: {
            //default duration is 30 days
            type: Date,
            default: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))
        },
        is_active: {
            type: Boolean,
            default: false
        },
        is_expired: {
            type: Boolean,
            default: false
        },
        is_cancelled: {
            type: Boolean,
            default: false
        },
        is_suspended: {
            type: Boolean,
            default: false
        },
        is_renewed: {
            type: Boolean,
            default: false
        },
        expires_at: { type: Date, },
        cancelled_on: { type: Date, }
        , suspended_on: { type: Date, }
        , renewed_on: { type: Date, },
        renewed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', }
    },


    total_usage: {
        request_limit: { type: Number, default: 5000 },
        request_count: { type: Number, default: 0 },
    }


    ,
    monthly_usage: [{
        month: { type: Number, default: new Date().getMonth() },
        usage: {
            request_limit: { type: Number, default: 5000 },
            request_count: { type: Number, default: 0 },
        }
    }]
    ,

    is_blocked: {
        status: {
            type: Boolean,
            default: false
        },
        reason: {
            type: String,
            default: 'Violated the terms and conditions'
        },
        since: {
            type: Date,
        }
        ,
        to: {
            type: Date,
        },
        by: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Users',

        }

    },
    db_token: [
        {
            token: {
                type: String,
                required: true,
                created_at: Date.now,
            }
        }
    ]
    ,
    secrate_key: {
        type: String,
        required: true,
        unique: true,
        //uid string with 56 characters
        default: uuidv4

    }


})

const App = mongoose.model<AppInterface>('Apps', app_schema);

export default App;