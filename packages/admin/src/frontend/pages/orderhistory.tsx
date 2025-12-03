import React, { useEffect, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


interface OrderItem {
    product: string;
    quantity: number;
    item_total: string;
}

interface Order {
    id: number;
    email: string;
    total_amount: string;
    created_at: string;
    items: OrderItem[];
}

const OrderHistory: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filterEmail, setFilterEmail] = useState("");

    useEffect(() => {
        fetchOrders();
    }, [filterEmail]);

    const fetchOrders = async () => {
        try {
            const url = filterEmail
                ? `${API_BASE_URL}/api/orders/all?email=${filterEmail}`
                : `${API_BASE_URL}/api/orders/all`;

            const res = await fetch(url);
            const data = await res.json();

            const sortedData = data.sort(
                (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            setOrders(sortedData);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };


    return (
        <div style={{ padding: "20px" }}>
            <h2>🧾 Order History</h2>

            {/* 🔎 Filter bar */}
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Filter by Email"
                    value={filterEmail}
                    onChange={(e) => setFilterEmail(e.target.value)}
                    style={{
                        padding: "8px",
                        width: "250px",
                        marginRight: "10px",
                    }}
                />
                <button onClick={fetchOrders} style={{ padding: "8px 15px" }}>
                    Search
                </button>
            </div>

           
            <table border={1} cellPadding={8} cellSpacing={0} width="100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User Email</th>
                        <th>Products</th>
                        <th>Total Amount</th>
                        <th>Order Time</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.email}</td>
                                <td>
                                    {order.items.map((item, i) => (
                                        <div key={i}>
                                            🛍️ <strong>{item.product}</strong> × {item.quantity} = ₹{item.item_total}
                                        </div>
                                    ))}
                                </td>
                                <td>₹{order.total_amount}</td>
                                <td>{new Date(order.created_at).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>No orders found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderHistory;
