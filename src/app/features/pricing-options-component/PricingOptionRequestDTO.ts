export interface PricingOptionRequestDTO {
    licenseTypeId: number;
    billingCycle: 'MONTHLY' | 'ANNUAL_MONTHLY' | 'ANNUAL_UPFRONT';
    contractDurationMonths: number;
    price: number;
}