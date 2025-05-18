export interface Contact {
    identifier: string;
    name: string;
    email: string;
    cellphone: string | null;
    phone: string;
    favorite: boolean;
    active: boolean;
    createdAt: string;
    userDTO: {
        identifier: string;
        username: string;
        email: string;
    };
}