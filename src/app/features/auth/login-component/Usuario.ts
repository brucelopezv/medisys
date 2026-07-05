export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    empresa: string;
    roles: string[];
    mustChangePassword: boolean;
}
