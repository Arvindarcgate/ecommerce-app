import { Request, Response } from 'express';
import Coupon from '../models/coupon';

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      usageLimitPerUser,
      startDate,
      endDate,
      status,
    } = req.body;

    const coupon = await Coupon.query().insert({
      code,
      discount_type: discountType,
      discount_value: discountValue,
      min_order_amount: minOrderAmount,
      max_discount: maxDiscount,
      usage_limit_per_user: usageLimitPerUser,
      start_date: startDate,
      end_date: endDate,
      status,
    });

    return res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon,
    });
  } catch (error: any) {
    console.error('Create Coupon Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create coupon',
    });
  }
};

export const getAllCoupons = async (_req: Request, res: Response) => {
  try {
    const coupons = await Coupon.query()
      .select(
        'id',
        'code',
        'discount_type',
        'discount_value',
        'min_order_amount',
        'max_discount',
        'usage_limit_per_user',
        'start_date',
        'end_date',
        'status'
      )
      .orderBy('created_at', 'desc');

    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coupons',
    });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Coupon.query().deleteById(id);

    return res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    console.error('Delete Coupon Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete coupon',
    });
  }
};
