// src/components/FeaturedProducts.tsx
import React from "react";
import { ShoppingCart, MoveRight } from "lucide-react";
import Container from "../../../style/component/ui/Container";
import styles from "./product.module.css"; // adjust path

type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 124,
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    rating: 4.6,
    reviews: 89,
    badge: "New",
  },
  {
    id: 3,
    name: "Professional Camera Lens",
    price: 849.99,
    image:
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop",
    rating: 4.9,
    reviews: 67,
    badge: "Pro Choice",
  },
  {
    id: 4,
    name: "Ergonomic Office Chair",
    price: 449.99,
    originalPrice: 599.99,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 156,
    badge: "Sale",
  },
];

const FeaturedProducts: React.FC = () => {
  return (
    <div className={styles.products}>
      <Container>
        <h1>Featured Products</h1>
        <p>
          Discover our hand-picked selection of premium products that our
          customers <br /> love most
        </p>

        {/* Product Cards */}
        <div className={styles.productCards}>
          {products.map((product) => (
            <div className={styles.card} key={product.id}>
              <div className={styles.imageWrapper}>
                <img src={product.image} alt={product.name} />
                {product.badge && (
                  <span className={styles.badge}>{product.badge}</span>
                )}
              </div>

              <h4>{product.name}</h4>

              <div className={styles.price}>
                <span className={styles.currentPrice}>
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className={styles.originalPrice}>
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className={styles.rating}>
                ⭐ {product.rating} ({product.reviews} reviews)
              </div>

              <button className={styles.heroPrimary}>
                <ShoppingCart size={16} /> View Details
              </button>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "Flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "24px",
          }}
        >
          <button className={styles.bottomproduct}>
            View All Products <MoveRight size={18} />
          </button>
        </div>
      </Container>
    </div>
  );
};

export default FeaturedProducts;
