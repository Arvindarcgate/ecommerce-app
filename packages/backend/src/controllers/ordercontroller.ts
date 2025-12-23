import { Request, Response } from 'express';
import { db } from '../db/db';
import { applyCoupon } from '../service/coupon.service'; 


export const createOrder = async (req: Request, res: Response) => {
  const { email, items, totalAmount } = req.body;

  if (!email || !items || items.length === 0) {
    return res.status(400).json({ message: 'Invalid order data' });
  }

  try {
    const [orderId] = await db('orders').insert({
      email,
      total_amount: totalAmount,
      created_at: new Date(),
    });

    for (const item of items) {
      await db('order_items').insert({
        order_id: orderId,
        product_id: item.product_id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      });
    }

    res.status(201).json({
      message: ' Order placed successfully',
      orderId,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({
      message: 'Server error while placing order',
      error: error.message,
    });
  }
};




export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const email = req.query.email?.toString().trim() || null;

    let query = db('orders as o')
      .leftJoin('order_items as oi', 'o.id', 'oi.order_id')
      .select(
        'o.id',
        'o.email',
        'o.total_amount',
        'o.created_at',
        'oi.name as product',
        'oi.quantity',
        'oi.total as item_total'
      )
      .orderBy('o.created_at', 'desc');

    if (email && email.length > 0) {
      query = query.where('o.email', '=', email);
    }

    const rows = await query;

    const ordersMap: Record<number, any> = {};

    for (const row of rows) {
      if (!ordersMap[row.id]) {
        ordersMap[row.id] = {
          id: row.id,
          email: row.email,
          total_amount: row.total_amount,
          created_at: row.created_at,
          items: [],
        };
      }
      ordersMap[row.id].items.push({
        product: row.product,
        quantity: row.quantity,
        item_total: row.item_total,
      });
    }

    res.json(Object.values(ordersMap));
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};
