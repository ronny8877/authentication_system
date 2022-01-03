import { Document } from "mongoose";



interface userList {
    token: string;
    uid: string;
    is_blocked: string;
    created_at: Date;


}

export interface AppDb extends Document {
    app_name: string;
    created_at: string;
    app_id: string;
    app_token: string;
    users: userList



}