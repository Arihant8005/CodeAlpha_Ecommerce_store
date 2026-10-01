import { useEffect, useState } from "react";
import "./AdminProducts.css";

const API_URL = "http://localhost:5000/api/products";

function AdminProducts() {
    const [products, setProducts] = useState([]);

    const [form, setForm] = useState({
        name: "",
        price: "",
        description: "",
        image: "",
        category: "",
    });

    const [editingId, setEditingId] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const fetchProducts = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be smaller than 5 MB.");
            return;
        }

        try {
            setUploadingImage(true);

            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch(
                "http://localhost:5000/api/products/upload-image",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Image upload failed");
                return;
            }

            setForm((previousForm) => ({
                ...previousForm,
                image: data.imageUrl,
            }));

            alert("Image uploaded successfully!");
        } catch (error) {
            console.error(error);
            alert("Image upload failed");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Something went wrong");
                return;
            }

            alert(
                editingId
                    ? "Product updated successfully!"
                    : "Product added successfully!"
            );

            setForm({
                name: "",
                price: "",
                description: "",
                image: "",
                category: "",
            });

            setEditingId(null);

            fetchProducts();
        } catch (error) {
            console.error(error);
            alert("Server error");
        }
    };

    const handleEdit = (product) => {
        setEditingId(product._id);

        setForm({
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            category: product.category,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to delete product");
                return;
            }

            alert("Product deleted successfully!");

            fetchProducts();
        } catch (error) {
            console.error(error);
            alert("Server error");
        }
    };

    return (
        <main className="admin-products-page">
            <div className="admin-products-header">
                <h1>Product Management</h1>
                <p>Add, edit and remove products from your store.</p>
            </div>

            <section className="product-form-card">
                <h2>
                    {editingId ? "Edit Product" : "Add New Product"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="Enter price"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <input
                                type="text"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                placeholder="e.g. Electronics"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Product Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            {uploadingImage && (
                                <p>Uploading image...</p>
                            )}
                            {form.image && (
                                <small>
                                    Image uploaded successfully
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Enter product description"
                            rows="4"
                            required
                        />
                    </div>

                    {form.image && (
                        <div className="image-preview">
                            <p>Image Preview</p>
                            <img
                                src={form.image}
                                alt="Product preview"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="submit">
                            {editingId ? "Update Product" : "Add Product"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="cancel-edit"
                                onClick={() => {
                                    setEditingId(null);
                                    setForm({
                                        name: "",
                                        price: "",
                                        description: "",
                                        image: "",
                                        category: "",
                                    });
                                }}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section className="admin-product-list">
                <h2>Existing Products</h2>

                {products.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    <div className="admin-product-grid">
                        {products.map((product) => (
                            <div
                                className="admin-product-card"
                                key={product._id}
                            >
                                <div className="admin-product-image">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                        />
                                    ) : (
                                        <span>🛍️</span>
                                    )}
                                </div>

                                <div className="admin-product-info">
                                    <h3>{product.name}</h3>

                                    <p className="admin-product-category">
                                        {product.category}
                                    </p>

                                    <p>{product.description}</p>

                                    <strong>
                                        ₹{product.price.toLocaleString("en-IN")}
                                    </strong>

                                    <div className="admin-product-actions">
                                        <button
                                            onClick={() =>
                                                handleEdit(product)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-product"
                                            onClick={() =>
                                                handleDelete(product._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default AdminProducts;