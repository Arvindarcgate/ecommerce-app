import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./adminproductlaunch.module.css";
import { API_BASE_URL } from '../config/env';
import toast from "react-hot-toast";
import ConfirmationModal from "./conformationModal";

interface Product {
    productName: string;
    price: number;
    size: string;
    imagePreview: string;
}

const GetReadyPage: React.FC = () => {
    const [queue, setQueue] = useState<Product[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"launch" | "delete" | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const storedQueue = JSON.parse(localStorage.getItem("productQueue") || "[]");
        setQueue(storedQueue);
    }, []);

    const urlToFile = async (url: string, filename: string): Promise<File> => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new File([blob], filename, { type: blob.type });
    };

    const openModal = (type: "launch" | "delete", index: number) => {
        setModalType(type);
        setSelectedIndex(index);
        setModalOpen(true);
    };

    const handleConfirm = async () => {
        if (selectedIndex === null || modalType === null) return;

        if (modalType === "launch") {
            const product = queue[selectedIndex];

            try {
                const imageFile = await urlToFile(product.imagePreview, `${product.productName}.png`);

                const formData = new FormData();
                formData.append("name", product.productName);
                formData.append("price", product.price.toString());
                formData.append("size", product.size);
                formData.append("image", imageFile);

                const response = await fetch(`${API_BASE_URL}/api/products/add`, {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();

                if (response.ok) {
                    toast.success(`${product.productName} launched successfully!`);

                    const updatedQueue = queue.filter((_, i) => i !== selectedIndex);
                    setQueue(updatedQueue);
                    localStorage.setItem("productQueue", JSON.stringify(updatedQueue));

                    if (updatedQueue.length === 0) navigate("/");
                } else {
                    toast.error(data.message || "Something went wrong");
                }
            } catch {
                toast.error("Server error. Please try again later.");
            }
        }

        if (modalType === "delete") {
            const updatedQueue = queue.filter((_, i) => i !== selectedIndex);
            setQueue(updatedQueue);
            localStorage.setItem("productQueue", JSON.stringify(updatedQueue));
        }

        setModalOpen(false);
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

                            <div className={styles.buttonGroup}>
                                <button
                                    onClick={() => openModal("launch", index)}
                                    className={`${styles.launchBtn} ${styles.button}`}
                                >
                                    Launch
                                </button>

                                <button
                                    onClick={() => openModal("delete", index)}
                                    className={`${styles.deleteBtn} ${styles.button}`}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmationModal
                open={modalOpen}
                title={modalType === "launch" ? "Launch Product" : "Delete Product"}
                message={
                    modalType === "launch"
                        ? "Are you sure you want to launch this product?"
                        : "Are you sure you want to delete this product?"
                }
                onConfirm={handleConfirm}
                onCancel={() => setModalOpen(false)}
            />
        </div>
    );
};

export default GetReadyPage;
