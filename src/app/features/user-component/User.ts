
import { Role } from "../roles-component/Role";
import { UserStatus } from "./UserStatus";

export interface User {
    id?: number;
    username: string;
    password?: string;
    firstName: string;
    lastName: string;
    email: string;
    companyId: string;    
    companyName: string;    
    status: UserStatus;
    emailVerified: boolean;
    createdAt?: Date;
    roles: Role[];
    mustChangePassword: boolean;
}