import {
    Document
} from "mongoose";

 interface UserInterface extends Document {
     _id:string;
     name: string
     email:string
     password: string
     phone: number
     role: string
     isActive: boolean;
     createdAt: Date;
     updatedAt: Date;
     dob: Date;
     isVerified: boolean;
     isBlocked: boolean;
     app_access: string ;
     gender: string
     isUnique:Function;
     generateJwtToken: Function;
     confirmPassword: Function;
       }

export default UserInterface