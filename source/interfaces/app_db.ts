import { Document } from "mongoose";



interface userList {
    token: string;
    uid: string;
    is_blocked: string;
    created_at: Date;


}

interface AccessMethods {
    method_name: string;
    //add types of methods here
    is_active: boolean;
}
interface DbUsage {
    request_count: number
    method_access: string

}
export interface AppDb extends Document {
    app_name: string;
    created_at: string;
    app_id: string;
    app_token: string;
    users: userList



}