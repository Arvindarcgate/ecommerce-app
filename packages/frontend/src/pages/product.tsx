import React, { useEffect, useState } from "react";
import styles from "../style/pages/product.module.css";

interface Product {
  id: number;
  name: string;
  price: number;
  size: string;
  image: string;
}

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    fetch("http://localhost:8000/api/products/all")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        const initialQuantities = data.reduce(
          (acc: any, product: Product) => ({ ...acc, [product.id]: 1 }),
          {}
        );
        setQuantities(initialQuantities);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleQuantityChange = (id: number, value: number) => {
    if (value < 1) return; // Prevent 0 or negative quantity
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleBuyNow = (product: Product) => {
    const quantity = quantities[product.id];
    const totalPrice = product.price * quantity;
    console.log("🛒 Added to cart:", { ...product, quantity, totalPrice });
    alert(`✅ ${product.name} (x${quantity}) added to cart — Total: $${totalPrice}`);
  };

  return (
    <div className={styles.productContainer}>
      <h1 className={styles.pageTitle}>🛍️ Discover Amazing Products</h1>

      <div className={styles.productGrid}>
        {products.map((product) => {
          const quantity = quantities[product.id] || 1;
          const totalPrice = product.price * quantity;

          return (
            <div className={styles.productCard} key={product.id}>
              <div className={styles.imageWrapper}>
                <img
                  src={`http://localhost:8000${product.image}`}
                  alt={product.name}
                  className={styles.productImage}
                />
              </div>

              <div className={styles.productDetails}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productSize}>Size: {product.size}</p>
                <p className={styles.productPrice}>💰 Price: ${product.price}</p>

                <div className={styles.quantityContainer}>
                  <label htmlFor={`qty-${product.id}`}>Qty:</label>
                  <input
                    type="number"
                    id={`qty-${product.id}`}
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(product.id, Number(e.target.value))
                    }
                    className={styles.quantityInput}
                  />
                </div>

                {/* ✅ Dynamic total price */}
                <p className={styles.updatedPrice}>
                  Total: <strong>${totalPrice.toFixed(2)}</strong>
                </p>

                <button
                  className={styles.buyButton}
                  onClick={() => handleBuyNow(product)}
                >
                  🛒 Buy Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductPage;
