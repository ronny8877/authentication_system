
import mongoose, { Schema } from 'mongoose';
import { AppDb } from '../interfaces/app_db';

const app_db_schema = new Schema({
    app_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Apps',
        required: true,
        unique: true

    },
    created_at: {
        type: Date,
        default: Date.now
    },
    app_name: {
        type: String,
        required: true,
        maxlength: 64,
        minlength: 3
    },
    app_token: {
        type: String,
        required: true,
        unique: true,

    },
    users: [
        {
            created_at: { type: Date, default: Date.now },
            is_blocked: {
                type: Boolean,
                default: false

            },
            user_token: {
                type: String,
                required: true,
                unique: true,


            },
            uid: {
                type: mongoose.Schema.Types.ObjectId, ref: 'Users',
                required: true,
                unique: true
            }
        }]
});


const App_Db = mongoose.model<AppDb>('App_Db', app_db_schema);
export default App_Db;