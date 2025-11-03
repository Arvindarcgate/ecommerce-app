import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./getready.module.css";

interface Product {
    productName: string;
    price: number;
    size: string;
    image: File;
    imagePreview: string;
}

const GetReadyPage: React.FC = () => {
    const [queue, setQueue] = useState<Product[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedQueue = JSON.parse(localStorage.getItem("productQueue") || "[]");
        setQueue(storedQueue);
    }, []);

    const handleLaunch = async (index: number) => {
        const product = queue[index];
        const confirmLaunch = window.confirm(
            `🚀 Are you sure you want to launch "${product.productName}"?`
        );
        if (!confirmLaunch) return;

        const formData = new FormData();
        formData.append("name", product.productName);
        formData.append("price", product.price.toString());
        formData.append("size", product.size);
        formData.append("image", product.image);

        try {
            const response = await fetch("http://localhost:8000/api/products/add", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                alert(`✅ ${product.productName} launched successfully!`);

                // 🧹 Remove launched product from queue
                const updatedQueue = queue.filter((_, i) => i !== index);
                setQueue(updatedQueue);
                localStorage.setItem("productQueue", JSON.stringify(updatedQueue));

                // Redirect if queue empty
                if (updatedQueue.length === 0) navigate("/");
            } else {
                alert(`❌ Error: ${data.message || "Something went wrong"}`);
            }
        } catch (error) {
            console.error("Error launching product:", error);
            alert("Server error. Please try again later.");
        }
    };

    return (
        <div className={styles.container}>
            <h2>🚀 Product Launch Queue</h2>
            {queue.length === 0 ? (
                <p>No products in queue. Go back to add more.</p>
            ) : (
                <div className={styles.queue}>
                    {queue.map((product, index) => (
                        <div key={index} className={styles.card}>
                            <img
                                src={product.imagePreview}
                                alt={product.productName}
                                className={styles.image}
                            />
                            <h3>{product.productName}</h3>
                            <p>Size: {product.size}</p>
                            <p>Price: ₹{product.price}</p>
                            <button
                                onClick={() => handleLaunch(index)}
                                className={styles.launchBtn}
                            >
                                Launch
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GetReadyPage;
