import { SubscriptionStatus } from "./SubscriptionStatus";

export interface Subscription {

    id?: number;
    companyId: number;
    licensePricingOptionId: number;
    startDate: string;
    endDate: string;
    status?: SubscriptionStatus | string;
    companyName?: string;
    licenseName?: string;
    createdAt?: string;

}