
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

    request_count: number

    request_limit: number


}


interface MonthlyUsage {
    month: number
    usage: AppUsage

}


interface AppInterface extends Document {
    _id: string;
    app_name: string;
    display_picture: string;
    alias: string;
    created_by: string;
    created_at: Date;
    monthly_usage: [MonthlyUsage]
    total_usage: AppUsage;
    app_token: string;
    is_active: boolean;
    active_plan: ActivePlan;
    is_blocked: IsBlocked;
    db_token: any;
    secrete_key: string;

}

export default AppInterface