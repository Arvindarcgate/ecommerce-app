import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styles from "./product.module.css";

const ProductPages: React.FC = () => {
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState<number | "">("");
    const [size, setSize] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!productName || !price || !size || !imagePreview) {
            alert("Please fill all fields before submitting.");
            return;
        }

        const newProduct = { productName, price, size, imagePreview };

        try {
            const existingQueue = JSON.parse(localStorage.getItem("productQueue") || "[]");
            localStorage.setItem("productQueue", JSON.stringify([...existingQueue, newProduct]));
            navigate("/getReady");
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    };

    return (
        <div className={styles.container} data-testid="product-page">
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
                        aria-label="Product Name"
                    />
                    <input
                        type="number"
                        placeholder="Enter Price"
                        value={price}
                        onChange={(e) =>
                            setPrice(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        required
                        className={styles.input}
                        aria-label="Product Price"
                    />
                    <input
                        type="text"
                        placeholder="Enter Size (e.g., S, M, L, XL)"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        required
                        className={styles.input}
                        aria-label="Product Size"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        className={styles.input}
                        aria-label="file"
                        data-testid="file-input"
                    />

                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className={styles.previewImage}
                            data-testid="image-preview"
                        />
                    )}

                    <button type="submit" className={styles.button}>
                        Preview Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductPages;
