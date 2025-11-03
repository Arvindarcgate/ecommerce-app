import React, { useState } from 'react';
import styles from './product.module.css';

const ProductPages: React.FC = () => {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState<number | ''>(''); // ✅ use price instead of quantity
    const [size, setSize] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!productName || !price || !size || !image) {
            alert('Please fill all fields before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('name', productName);
        formData.append('price', price.toString()); // ✅ correct field
        formData.append('size', size);
        formData.append('image', image);

        try {
            const response = await fetch('http://localhost:8000/api/products/add', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                alert('✅ Product added successfully!');
                console.log('🛍️ Product submitted:', data);

                // ✅ reset fields
                setProductName('');
                setPrice('');
                setSize('');
                setImage(null);
            } else {
                alert(`❌ Error: ${data.message || 'Something went wrong'}`);
            }
        } catch (error) {
            console.error('Error submitting product:', error);
            alert('Server error. Please try again later.');
        }
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

                    {/* ✅ Corrected to Price Field */}
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
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductPages;
