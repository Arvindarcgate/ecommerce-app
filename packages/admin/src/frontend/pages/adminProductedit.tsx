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
      if (!res.ok) return;
      const data = await res.json();
      setProducts(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setUpdatedImage(null);
  };

  const handleDeleteClick = (id: number) => {
    console.log("This Delete !!");
    setDeleteId(id);
  };

  const handleDelete = async () => {
    console.log("This Delete is function is called");
    if (deleteId === null) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/delete/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Delete failed");
        return;
      }

      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    } catch (error) {
    } finally {
      setDeleteId(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("name", editingProduct.name);
    formData.append("price", editingProduct.price.toString());
    formData.append("size", editingProduct.size);
    if (updatedImage) {
      formData.append("image", updatedImage);
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/products/update/${editingProduct.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!res.ok) {
        toast.error("Update failed");
        return;
      }

      toast.success("Product updated");
      fetchProducts();
      setEditingProduct(null);
    } catch (error) {
    } finally {
      setLoading(false);
    }
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
            <p>Size: {product.size}</p>

            <div className={styles.actions}>
              <button
                onClick={() => handleEdit(product)}
                className={styles.editBtn}
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteClick(product.id)}
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

      {deleteId !== null && (
  <ConfirmationModal
    open={true}
    title="Delete Product"
    message="Are you sure you want to delete this product?"
    onConfirm={handleDelete}
    onCancel={() => setDeleteId(null)}
  />
)}

    </div>
  );
};

export default AdminProductEdit;
