import { CompanyStatus } from "./CompanyStatus";

export interface Company {

    id?: number;
    name: string;
    legalName: string;
    taxId?: string;
    address?: string;
    website?: string;
    postalCode?: string;
    contactEmail: string;
    contactPhone?: string;
    status: CompanyStatus;
    emailVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;

}
