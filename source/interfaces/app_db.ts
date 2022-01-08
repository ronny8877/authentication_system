import { Document } from "mongoose";



interface userList {
    user_token: string;
    uid: string;
    is_blocked: string;
    created_at: Date;
    update: Function;

}

interface AccessMethods {
    method_name: string;
    //add types of methods here
    is_active: boolean;


}

export interface AppDb extends Document {
    app_name: string;
    created_at: string;
    app_id: string;
    app_token: string;
    users: [userList]
    access: AccessMethods;
    db_token: string;


}