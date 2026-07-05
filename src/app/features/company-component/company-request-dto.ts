import { CompanyStatus } from "./CompanyStatus";

export interface CompanyRequestDTO {

    name: string;
    address?: string;
    legalName?: string;
    taxID?: string;
    website?: string;
    postalCode?: string;
    contactEmail: string;
    contactPhone?: string;
    status?: CompanyStatus;
    emailVerified?: boolean;

}
