import { Model } from 'objection';

export default class Coupon extends Model {
  id!: number;
  code!: string;
  discount_type!: 'PERCENTAGE' | 'FLAT';
  discount_value!: number;
  min_order_amount!: number;
  max_discount!: number;
  usage_limit_per_user!: number;
  start_date!: string;
  end_date!: string;
  status!: 'ACTIVE' | 'INACTIVE';
  created_at!: string;
  updated_at!: string;

  static tableName = 'coupons';

  static idColumn = 'id';

  static jsonSchema = {
    type: 'object',
    required: [
      'code',
      'discount_type',
      'discount_value',
      'min_order_amount',
      'max_discount',
      'usage_limit_per_user',
      'start_date',
      'end_date',
      'status',
    ],

    properties: {
      id: { type: 'integer' },

      code: { type: 'string', minLength: 1, maxLength: 255 },

      discount_type: {
        type: 'string',
        enum: ['PERCENTAGE', 'FLAT'],
      },

      discount_value: { type: 'number' },
      min_order_amount: { type: 'number' },
      max_discount: { type: 'number' },

      usage_limit_per_user: { type: 'integer' },

      start_date: { type: 'string', format: 'date' },
      end_date: { type: 'string', format: 'date' },

      status: {
        type: 'string',
        enum: ['ACTIVE', 'INACTIVE'],
      },

      created_at: { type: 'string' },
      updated_at: { type: 'string' },
    },
  };
}

