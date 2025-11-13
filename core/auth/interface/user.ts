export interface Role {
    nombre_rol: string;
}

export interface Formacion {
    ficha: string;
    nombre_programa: string;
}

export interface User {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    documento: string;
    role: Role;
    formacion: Formacion;
}

export interface userQR {
    nombre: string;
    documento: string;
}
