
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "../style/pages/cart.module.css";
import { useNavigate } from "react-router-dom";

interface Product {
    id: number;
    name: string;
    price: number;
    size: string;
    image: string;
    quantity: number;
}

interface LocationState {
    product?: Product;
}


const CartPage: React.FC = () => {
    const location = useLocation();
    const { product } = (location.state || {}) as LocationState;
    const navigate = useNavigate();


    const [cartItems, setCartItems] = useState<Product[]>(() => {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    const [user, setUser] = useState<{ email: string } | null>(null);


    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser({ email: "guest@example.com" });
        }
    }, []);


    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser({ email: "guest@example.com" });
        }
    }, [])

    useEffect(() => {
        if (product) {
            setCartItems((prev) => {
                const existing = prev.find((item) => item.id === product.id);
                if (existing) {
                    return prev.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity }
                            : item
                    );
                }
                return [...prev, { ...product, quantity: 1 }];
            });
        }
    }, [product]);

    // 💾 Store cart persistently
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // 🧮 Update quantity
    const handleQuantityChange = (id: number, qty: number) => {
        if (qty < 1) return;
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: qty } : item
            )
        );
    };

    // ❌ Remove item
    const handleRemove = (id: number) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    // 💰 Calculate total
    const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    // 🚀 Final Order (later send to backend)
    // 🚀 Final Order (send to backend)
    const handleFinalOrder = async () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const orderData = {
            email: user?.email, // user's email as primary key
            items: cartItems.map((item) => ({
                product_id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity,
            })),
            totalAmount: total,
        };

        try {
            const res = await fetch("http://localhost:8000/api/orders/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            const data = await res.json();

            if (res.ok) {
                alert(`✅ Order placed successfully!\nOrder ID: ${data.orderId}`);
                setCartItems([]);
                localStorage.removeItem("cart");
            } else {
                alert(`❌ Failed to place order: ${data.message}`);
            }
        } catch (err) {
            console.error("Error placing order:", err);
            alert("⚠️ Something went wrong while placing the order.");
        }
    };


    return (
        <div className={styles.cartContainer}>
            <h1 className={styles.title}>🛒 Your Shopping Cart</h1>

            <div className={styles.userInfo}>
                {user ? (
                    <p>
                        Welcome, <strong>{user.email.split("@")[0]}</strong>
                    </p>
                ) : (
                    <p>Welcome, Guest</p>
                )}

                <button
                    className={styles.addMoreBtn}
                    onClick={() => navigate("/productpage")}
                >
                    ➕ Add More Products
                </button>
            </div>


            {cartItems.length === 0 ? (
                <p className={styles.emptyCart}>Your cart is empty.</p>
            ) : (
                <>
                    <div className={styles.cartList}>
                        {cartItems.map((item) => (
                            <div key={item.id} className={styles.cartCard}>
                                <img
                                    src={`http://localhost:8000${item.image}`}
                                    alt={item.name}
                                    className={styles.image}
                                />
                                <div className={styles.details}>
                                    <h3>{item.name}</h3>
                                    <p>Size: {item.size}</p>
                                    <p>Price: ₹{item.price}</p>
                                    <div className={styles.quantityRow}>
                                        <label>Qty:</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(item.id, Number(e.target.value))
                                            }
                                            className={styles.quantityInput}
                                        />
                                    </div>
                                    <p>
                                        Total: <strong>₹{item.price * item.quantity}</strong>
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className={styles.removeBtn}
                                >
                                    ❌ Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={styles.summary}>
                        <h2>Total Amount: ₹{total}</h2>
                        <button onClick={handleFinalOrder} className={styles.finalBtn}>
                            🏁 Final Order
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
