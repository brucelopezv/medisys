import { ModuleApp } from "../../features/module-component/moduleapp";

export interface Permission {

    id: number;
    moduleId: number;
    moduleName?: string;
    action: string;
    description: string;

}
