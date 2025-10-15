import { Model } from '../db/db';

// export interface IUser {
//     id: number;
//     email: string;
//     password: string;
//     role: "user" | "admin";
//     created_at?: string;
//     updated_at?: string;
// }

// export class User extends Model implements IUser {
//     id!: number;
//     email!: string;
//     password!: string;
//     role!: "user" | "admin";
//     created_at?: string;
//     updated_at?: string;

//     static tableName = "users";
//     static idColumn = "id";
// }



export interface IUser {
    id: number;
    email: string;
    password: string;
    role: "user" | "admin";
    is_verified?: boolean;
    verification_token?: string;
    created_at?: string;
    updated_at?: string;
}

export class User extends Model implements IUser {
    id!: number;
    email!: string;
    password!: string;
    role!: "user" | "admin";
    is_verified?: boolean;
    verification_token?: string;
    created_at?: string;
    updated_at?: string;

    static tableName = "users";
    static idColumn = "id";
}
