import {
    Document
} from "mongoose";

interface AppInterface extends Document {
    _id: string;
    app_ame: string;
    created_by: string
    created_at: Date,
    type: string,
    app_token: string,
    is_blocked: boolean;
    app_access: string;
}

export default AppInterface