import {
    Document
} from "mongoose";

export default interface TokenInterface extends Document {
    _id: string;
    alias: string;
    issued_by: boolean;
    issued_for: boolean;
    expires_at: Date;
    token: string;
    is_active: boolean;
    created_at: Date;
    isUnique: Function;


}

