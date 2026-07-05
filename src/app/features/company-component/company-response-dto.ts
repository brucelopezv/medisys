import { CompanyStatus } from "./CompanyStatus";

export interface CompanyResponseDTO {

    id: number;
    name: string;
    address?: string;
    legalName?: string;
    taxID?: string;
    contactEmail: string;
    website?: string;
    postalCode?: string;
    contactPhone?: string;
    status: CompanyStatus;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;

}
