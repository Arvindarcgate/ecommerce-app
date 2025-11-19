import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../style/pages/cart.module.css";

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
    const navigate = useNavigate();

    const { product } = (location.state || {}) as LocationState;

    const firstRender = useRef(true);

    // CART STATE
    const [cartItems, setCartItems] = useState<Product[]>(() => {
        const stored = localStorage.getItem("cart");
        return stored ? JSON.parse(stored) : [];
    });

    // USER STATE
    const [user, setUser] = useState<{ email: string } | null>(null);

    // Load user only once
    useEffect(() => {
        try {
            const stored = localStorage.getItem("user");
            const parsed = stored ? JSON.parse(stored) : null;
            setUser(parsed?.email ? parsed : { email: "guest@example.com" });
        } catch {
            setUser({ email: "guest@example.com" });
        }
    }, []);

    // Add product once
    useEffect(() => {
        if (!product) return;

        setCartItems(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) return prev;
            return [...prev, { ...product, quantity: 1 }];
        });
    }, [product]);

    // Save to localStorage after first render
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // HANDLERS
    const handleQuantityChange = (id: number, qty: number) => {
        if (qty < 1) return;
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: qty } : item
            )
        );
    };

    const handleRemove = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser({ email: "guest@example.com" });
        navigate("/login");
    };

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleFinalOrder = async () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const orderData = {
            email: user?.email,
            items: cartItems.map(item => ({
                product_id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity
            })),
            totalAmount: total
        };

        try {
            const res = await fetch("http://localhost:8000/api/orders/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if (res.ok) {
                alert(`Order placed! ID: ${data.orderId}`);
                setCartItems([]);
                localStorage.removeItem("cart");
            } else {
                alert(`Failed: ${data.message}`);
            }
        } catch (err) {
            console.error(err);
            alert("Error placing order.");
        }
    };

    return (
        <div className={styles.cartContainer}>
            <h1 className={styles.title}>🛒 Your Shopping Cart</h1>

            {/* USER INFO */}
            <div className={styles.userInfo}>
                <p>
                    Welcome, <strong>{user?.email.split("@")[0]}</strong>
                </p>

                <div>
                    <button
                        className={styles.addMoreBtn}
                        onClick={() => navigate("/productpage")}
                    >
                        ➕ Add More Products
                    </button>

                    {user?.email !== "guest@example.com" && (
                        <button
                            className={styles.logoutBtn}
                            onClick={handleLogout}
                            style={{ marginLeft: "10px" }}
                        >
                            🚪 Logout
                        </button>
                    )}
                </div>
            </div>

            {/* CART ITEMS */}
            {cartItems.length === 0 ? (
                <p className={styles.emptyCart}>Your cart is empty.</p>
            ) : (
                <>
                    <div className={styles.cartList}>
                        {cartItems.map(item => (
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

                                    {/* --- UPDATED BLOCK WITH TEST IDs --- */}
                                    <div className={styles.quantityRow}>
                                        <label>Qty:</label>

                                        <button
                                            data-testid="decrease-btn"
                                            onClick={() =>
                                                handleQuantityChange(
                                                    item.id,
                                                    item.quantity - 1
                                                )
                                            }
                                        >
                                            -
                                        </button>

                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    item.id,
                                                    Number(e.target.value)
                                                )
                                            }
                                            className={styles.quantityInput}
                                        />

                                        <button
                                            data-testid="increase-btn"
                                            onClick={() =>
                                                handleQuantityChange(
                                                    item.id,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p>
                                        Total:{" "}
                                        <strong>
                                            ₹{item.price * item.quantity}
                                        </strong>
                                    </p>
                                </div>

                                <button
                                    data-testid="remove-btn"
                                    onClick={() => handleRemove(item.id)}
                                    className={styles.removeBtn}
                                >
                                    ❌ Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* SUMMARY */}
                    <div className={styles.summary}>
                        <h2>Total Amount: ₹{total}</h2>

                        <button
                            onClick={handleFinalOrder}
                            className={styles.finalBtn}
                        >
                            🏁 Final Order
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
