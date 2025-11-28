import React, { useEffect, useState } from "react";
import styles from "../pages/adminproductedit.module.css";
import toast from "react-hot-toast";
import ConfirmationModal from "./conformationModal";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;




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


const [deleteId, setDeleteId] = useState<number | null>(null);


const fetchProducts = async () => {
try {
const res = await fetch(`${API_BASE_URL}/api/products/all`);
if (!res.ok) return console.error("Failed to fetch products:", res.status);
const data = await res.json();
setProducts(data);
} catch (error) {
console.error("Error fetching products:", error);
}
};


useEffect(() => {
fetchProducts();
}, []);


const handleEdit = (product: Product) => {
setEditingProduct(product);
setUpdatedImage(null);
};


const confirmDelete = async () => {
if (deleteId === null) return;


try {
const res = await fetch(`${API_BASE_URL}/api/products/delete/${deleteId}`, {
method: "DELETE",
});


if (!res.ok) {
const err = await res.text();
console.error("Backend delete error:", err);
toast.error("Delete failed");
return;
}


toast.success("Product deleted!");
fetchProducts();
} catch (error) {
console.error("Error deleting product:", error);
} finally {
setDeleteId(null);
}
};

const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setLoading(true);
};



    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Manage Products</h2>

            <div className={styles.grid}>
                {products.map((product) => (
                    <div key={product.id} className={styles.card}>
                        <img
                            src={`${API_BASE_URL}${product.image}`}
                            alt={product.name}
                            className={styles.image}
                        />
                        <h3>{product.name}</h3>
                        <p>₹{product.price}</p>
                        <p> Size: {product.size}</p>

                        <div className={styles.actions}>
                            <button
                                onClick={() => handleEdit(product)}
                                className={styles.editBtn}
                            >
                                 Edit
                            </button>


                            <button
                                onClick={() => handleDelete(product.id)}
                                className={styles.deleteBtn}
                            >
                                 Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

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
                                setEditingProduct({
                                    ...editingProduct,
                                    size: e.target.value,
                                })
                            }
                            placeholder="Size"
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
                            <button type="submit" disabled={loading} className={styles.updateBtn}>
                                {loading ? "⏳ Updating..." : "Update"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setEditingProduct(null)}
                                className={styles.cancelBtn}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminProductEdit;

