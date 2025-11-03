import { Request, Response } from "express";
import knex from "../db/Knex";

export const createOrder = async (req: Request, res: Response) => {
    const { email, items, totalAmount } = req.body;

    if (!email || !items || items.length === 0) {
        return res.status(400).json({ message: "Invalid order data" });
    }

    try {
        // 🧾 Insert main order
        const [orderId] = await knex("orders").insert({
            email,
            total_amount: totalAmount,
            created_at: new Date(), // ✅ add timestamp
        });

        // 🛍️ Insert order items
        for (const item of items) {
            await knex("order_items").insert({
                order_id: orderId,
                product_id: item.product_id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.total,
            });
        }

        res.status(201).json({
            message: "✅ Order placed successfully",
            orderId,
        });
    } catch (error: any) {
        console.error("❌ Error creating order:", error);
        res.status(500).json({
            message: "Server error while placing order",
            error: error.message,
        });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const { email } = req.query;

        // 🔗 Join orders + order_items
        let query = knex("orders as o")
            .select(
                "o.id",
                "o.email",
                "o.total_amount",
                "o.created_at",
                "oi.name as product",
                "oi.quantity",
                "oi.total as item_total"
            )
            .leftJoin("order_items as oi", "o.id", "oi.order_id")
            .orderBy("o.created_at", "desc");

        if (email) {
            query = query.where("o.email", email.toString());
        }

        const rows = await query;

        // 🧾 Group products under each order
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

        const orders = Object.values(ordersMap);

        res.json(orders);
    } catch (error) {
        console.error("❌ Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

