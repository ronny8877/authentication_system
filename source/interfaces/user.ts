import {
    Document
} from "mongoose";
import AppInterface from "./apps";

 interface UserInterface extends Document {
     _id:string;
     name: string
     email:string
     password: string
     phone: number
     role: string
     type: string,
     is_active: boolean;
     created_at: Date;
     updated_at: Date;
     dob: Date;
     is_verified: boolean;
     is_blocked: boolean;
     app_access: AppInterface;
     is_email_verified: boolean;
     is_phone_verified: boolean;
     display_picture: string;
     gender: string
     user_token: string;
     isUnique:Function;
     generateJwtToken: Function;
     confirmPassword: Function;
     hashPassword: Function,
     validatePassword: Function
       }

export default UserInterface