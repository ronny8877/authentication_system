import mongoose, {
    Schema
} from "mongoose";
import TokenInterface from "../interfaces/token"
import { v4 as uuidv4 } from 'uuid';
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';


const tokenSchema = new Schema({
    alias: {
        type: String,
        required: true,

    },
    issued_by
        : {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    issued_for
        : {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'apps'
    },
    expires_at
        : {
        required: true,
        //setting default expiry date to 7 days from now
        default: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
        type: Date,
    },
    token
        : {
        unique: true,
        type: String,
        required: true,
        default: uuidv4

    },
    is_active: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },

}
)

tokenSchema.methods.verify = function (uuid: string) {
    return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}



const Issued_token = mongoose.model<TokenInterface>('tokens', tokenSchema)
export default Issued_token;
