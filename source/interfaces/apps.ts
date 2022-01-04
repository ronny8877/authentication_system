
import { IsBlocked } from './user';
import {
    Document
} from "mongoose";


interface ActivePlan {
    plan_id: string;
    created: Date;
    updated: Date;
    status: string;
    duration: Date;
    is_active: boolean;
    is_expired: boolean;
    is_cancelled: boolean;
    is_suspended: boolean;
    is_renewed: boolean;
    expired_on: Date;
    cancelled_on: Date;
    suspended_on: Date;
    renewed_on: Date;
    renewed_by: string;

}

//for monetization purposes

interface AppUsage {
    active_plan: string
    active_month: Date,
    request_limit: number
    request_count: number
    method_access: string
}





interface AppInterface extends Document {
    _id: string;
    app_ame: string;
    alias: string;
    created_by: string;
    created_at: Date;
    type: string;
    usage: AppUsage;
    app_token: string;
    is_active: boolean;
    active_plan: ActivePlan;
    is_blocked: IsBlocked;

}

export default AppInterface