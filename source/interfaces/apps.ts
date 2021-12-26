import {
    Document
} from "mongoose";

interface UserInterface extends Document {
    _id: string;
    app_ame: string;
    created_by: string
    created_at: Date,
    type: string,
    is_blocked: boolean;
    app_access: string;
}

export default UserInterface