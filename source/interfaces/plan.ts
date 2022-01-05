export interface Plan {
    //type free base premium
    type: string;
    discount: number;
    price: number;
    duration: number;
    currency: string;
    request_limit: number;
    plan_name: string;
    description: string;
    metadata: any;
    created_at: Date;
    updated_at: Date;
    created_by: string;




}