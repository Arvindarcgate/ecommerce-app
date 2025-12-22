import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../style/pages/cart.module.css';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  const [cartItems, setCartItems] = useState<Product[]>(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  const [user, setUser] = useState<{ email: string } | null>(null);

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      const parsed = stored ? JSON.parse(stored) : null;
      setUser(parsed?.email ? parsed : { email: 'guest@example.com' });
    } catch {
      setUser({ email: 'guest@example.com' });
    }
  }, []);

  useEffect(() => {
    if (!product) return;

    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev;
      return [...prev, { ...product, quantity: 1 }];
    });
  }, [product]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleQuantityChange = (id: number, qty: number) => {
    if (qty < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemove = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser({ email: 'guest@example.com' });
    navigate('/login');
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error('Please enter a coupon code');
      return;
    }

    if (couponApplied) {
      toast.error('Coupon already applied');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/coupons/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode,
          cartAmount: total,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.valid) {
        toast.error(data.reason || 'Invalid coupon');
        return;
      }

      setDiscount(data.discountAmount);
      setCouponApplied(true);
      toast.success('Coupon applied successfully 🎉');
    } catch (error) {
      toast.error('Failed to apply coupon');
    }
  };

  const finalAmount = Math.max(total - discount, 0);

  const handleFinalOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    const orderData = {
      email: user?.email,
      items: cartItems.map((item) => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      totalAmount: total,
      discount: discount,
      finalAmount: finalAmount,
      couponCode: couponApplied ? couponCode : null,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Order placed! ID: ${data.orderId}`);
        setCartItems([]);
        localStorage.removeItem('cart');
      } else {
        toast.error(`Failed: ${data.message}`);
      }
    } catch (err) {
      toast.error('Error placing order.');
    }
  };

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.title}>🛒 Your Shopping Cart</h1>

      <div className={styles.userInfo}>
        <p>
          Welcome, <strong>{user?.email.split('@')[0]}</strong>
        </p>

        <div>
          <button
            className={styles.addMoreBtn}
            onClick={() => navigate('/productpage')}
          >
            ➕ Add More Products
          </button>

          {user?.email !== 'guest@example.com' && (
            <button
              className={styles.logoutBtn}
              onClick={handleLogout}
              style={{ marginLeft: '10px' }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {cartItems.length === 0 ? (
        <p className={styles.emptyCart}>Your cart is empty.</p>
      ) : (
        <>
          <div className={styles.cartList}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartCard}>
                <img
                  src={`${API_BASE_URL}${item.image}`}
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
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h2>Total Amount: ₹{total}</h2>

            <div className={styles.couponBox}>
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={couponApplied}
                className={styles.couponInput}
              />

              <button
                onClick={handleApplyCoupon}
                disabled={couponApplied}
                className={styles.couponBtn}
              >
                Apply
              </button>
            </div>

            {discount > 0 && (
              <>
                <p>
                  Discount: <strong>- ₹{discount}</strong>
                </p>
                <h2>Final Amount: ₹{finalAmount}</h2>
              </>
            )}

            <button onClick={handleFinalOrder} className={styles.finalBtn}>
              Final Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
