import { ModuleStatus } from "./ModuleStatus";


export interface ModuleApp {

    id: number;
    name: string;
    description: string;
    status: ModuleStatus;
    createdAt?: Date;
    updatedAt?: Date;

}
