import React, { useEffect, useState } from "react";
import styles from "../pages/adminproductedit.module.css"; // ✅ ensure correct path

interface Product {
    id: number;
    name: string;
    price: number;
    size: string;
    image: string;
}

const AdminProductEdit: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [updatedImage, setUpdatedImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    // 🟢 Fetch all products
    const fetchProducts = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/products/all");
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ✏️ Start editing
    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setUpdatedImage(null); // clear previous selection
    };

    // 🗑️ Delete product
    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(`http://localhost:8000/api/products/delete/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("🗑️ Product deleted successfully!");
                fetchProducts();
            } else {
                const data = await res.json();
                alert(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    // ✅ Submit edited product
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("name", editingProduct.name);
        formData.append("price", editingProduct.price.toString());
        formData.append("size", editingProduct.size);
        if (updatedImage) formData.append("image", updatedImage);

        try {
            const res = await fetch(
                `http://localhost:8000/api/products/update/${editingProduct.id}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );

            const data = await res.json();

            if (res.ok) {
                alert("✅ Product updated successfully!");
                setEditingProduct(null);
                setUpdatedImage(null);
                fetchProducts();
            } else {
                alert(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error updating product:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>🛠️ Manage Products</h2>

            <div className={styles.grid}>
                {products.map((product) => (
                    <div key={product.id} className={styles.card}>
                        <img
                            src={`http://localhost:8000${product.image}`}
                            alt={product.name}
                            className={styles.image}
                        />
                        <h3>{product.name}</h3>
                        <p>💰 ${product.price}</p>
                        <p>📏 Size: {product.size}</p>

                        <div className={styles.actions}>
                            <button
                                onClick={() => handleEdit(product)}
                                className={styles.editBtn}
                            >
                                ✏️ Edit
                            </button>
                            <button
                                onClick={() => handleDelete(product.id)}
                                className={styles.deleteBtn}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ Edit Form */}
            {editingProduct && (
                <div className={styles.editForm}>
                    <h3>Edit Product</h3>
                    <form onSubmit={handleUpdate}>
                        <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) =>
                                setEditingProduct({ ...editingProduct, name: e.target.value })
                            }
                            placeholder="Product Name"
                            required
                        />
                        <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) =>
                                setEditingProduct({
                                    ...editingProduct,
                                    price: Number(e.target.value),
                                })
                            }
                            placeholder="Price"
                            required
                        />
                        <input
                            type="text"
                            value={editingProduct.size}
                            onChange={(e) =>
                                setEditingProduct({ ...editingProduct, size: e.target.value })
                            }
                            placeholder="Size (e.g. S, M, L)"
                            required
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setUpdatedImage(e.target.files ? e.target.files[0] : null)
                            }
                        />
                        <div className={styles.formActions}>
                            <button type="submit" className={styles.updateBtn} disabled={loading}>
                                {loading ? "⏳ Updating..." : "✅ Update"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingProduct(null)}
                                className={styles.cancelBtn}
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminProductEdit;
