export interface Plan {
    //type free base premium
    type: string;
    amount: number;
    price: number;
    duration: number;
    currency: string;
    interval: string;
    interval_count: number;
    period_days: number;
    plan_name: string;
    description: string;
    statement_descriptor: string;
    metadata: any;
    created: Date;
    updated: Date;




}