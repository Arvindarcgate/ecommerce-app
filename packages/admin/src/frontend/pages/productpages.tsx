import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

import styles from "./product.module.css";

const ProductPages: React.FC = () => {
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState<number | "">("");
    const [size, setSize] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!productName || !price || !size || !image) {
            alert("Please fill all fields before submitting.");
            return;
        }

        const imagePreview = URL.createObjectURL(image);
        const newProduct = { productName, price, size, image, imagePreview };

        // 🧠 Save to localStorage queue
        const existingQueue = JSON.parse(localStorage.getItem("productQueue") || "[]");
        localStorage.setItem("productQueue", JSON.stringify([...existingQueue, newProduct]));

        navigate("/getReady");
    };
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>Add New Product</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        placeholder="Enter Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <input
                        type="number"
                        placeholder="Enter Price"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        required
                        className={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Enter Size (e.g., S, M, L, XL)"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        required
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>
                        Preview Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductPages;
