
import { IsBlocked } from './user';
import {
    Document
} from "mongoose";


interface ActivePlan {
    plan_id: string;
    created_at: Date;
    updated_at: Date;
    status: string;
    duration: Date;
    is_active: boolean;
    is_expired: boolean;
    is_cancelled: boolean;
    is_suspended: boolean;
    is_renewed: boolean;
    expired_at: Date;
    cancelled_on: Date;
    suspended_on: Date;
    renewed_on: Date;
    renewed_by: string;

}

//for monetization purposes

interface AppUsage {

    active_month: Date,
    request_limit: number
    request_count: number
}





interface AppInterface extends Document {
    _id: string;
    app_ame: string;
    alias: string;
    created_by: string;
    created_at: Date;
    usage: [AppUsage];
    app_token: string;
    is_active: boolean;
    active_plan: ActivePlan;
    is_blocked: IsBlocked;

}

export default AppInterface