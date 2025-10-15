
// src/models/Subscriber.ts
import { Model } from 'objection';

export default class Subscriber extends Model {
    id!: number;
    email!: string;
    created_at!: string;

    static tableName = 'subscribers';

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['email'],
            properties: {
                id: { type: 'integer' },
                email: { type: 'string', maxLength: 255 },
                created_at: { type: 'string' },
            },
        };
    }
}



