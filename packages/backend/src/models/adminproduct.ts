// packages/backend/src/models/productModel.ts
import { Model } from 'objection';

export class Product extends Model {
    id!: number;
    name!: string;
    price!: number;
    size!: string;
    image!: string;

    static tableName = 'products';

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'price', 'size', 'image'],
            properties: {
                id: { type: 'integer' },
                name: { type: 'string', minLength: 1, maxLength: 255 },
                price: { type: 'number' },
                size: { type: 'string', minLength: 1, maxLength: 50 },
                image: { type: 'string' },
            },
        };
    }
}
