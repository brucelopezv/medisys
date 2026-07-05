import { ModuleApp } from "../../features/module-component/moduleapp";
import { LicenseTypeStatus } from "./LicenseTypeStatus";


export interface LicenseType {

    id: number;
    name: string;
    description: string;
    maxUsers: number;
    maxDoctors: number;
    maxPatients: number;
    isCustom: boolean;
    visibleToPublic: boolean;
    status: LicenseTypeStatus;
    notes: string;
    modules: ModuleApp[];


}
