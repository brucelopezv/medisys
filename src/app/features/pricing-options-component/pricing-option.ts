import { LicenseType } from "../license-type-component/license-type";
import { LicenseTypeSelect } from "../license-type-component/LicenseTypeSelect";
import { BillingCycle } from "./BillingCycle";

export interface PricingOption {

    id?: number;
    licenseTypeId: number;
    licenseTypeName?: string;
    billingCycle: BillingCycle
    contractDurationMonths: number;
    price: number;
    createdAt?: string;
    updatedAt?: string;


}
