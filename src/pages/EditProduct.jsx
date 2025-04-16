import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSpinner,
    faArrowLeft,
    faBars,
    faChartLine,
    faBoxOpen,
    faSignOutAlt,
    faUpload
} from "@fortawesome/free-solid-svg-icons";
import "../assets/css/Dashboard.css";

const api = axios.create({
    baseURL: "http://localhost:8001/api/v1",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default function EditProduct() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        image: null,
        currentImage: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/products/${id}`);
                const product = response.data.product;
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    image: null,
                    currentImage: product.image || ""
                });
                if (product.image) {
                    setPreviewImage(product.image);
                }
            } catch (err) {
                console.error("Fetch product error:", err);
                setError(
                    err.response?.data?.message || "Failed to load product"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = e => {
        const { name, value } = e.target;
        if (name === "price") {
            if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileChange = e => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("price", formData.price);
            if (formData.image) {
                formDataToSend.append("image", formData.image);
            }

            const response = await api.post(`/products/${id}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            navigate("/products");
        } catch (err) {
            console.error("Update product error:", err);
            setError(err.response?.data?.message || "Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const navigateToDashboard = () => {
        navigate("/dashboard");
    };

    const navigateToProducts = () => {
        navigate("/products");
    };

    const handleLogout = async () => {
        try {
            await api.post("/logout");
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
            setError("Logout failed. Please try again.");
        }
    };

    if (loading && !formData.name) {
        return (
            <div className="full-page-loading">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Loading product details...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Dashboard Header */}
            <header className="dashboard-header">
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <div className="header-title">
                    <FontAwesomeIcon icon={faBoxOpen} className="title-icon" />
                    <h1>Edit Product</h1>
                </div>
            </header>

            <div className="dashboard-content-wrapper">
                {/* Sidebar */}
                <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
                    <div className="sidebar-logo">PrAdduct</div>

                    <div className="user-profile">
                        <img
                            src="/assets/user-icon.png"
                            alt="User"
                            className="user-avatar"
                            onError={e =>
                                (e.target.src =
                                    "/src/assets/images/default-avatar.png")
                            }
                        />
                        <div className="user-info">
                            <span className="user-firstname">
                                {user?.firstname}
                            </span>
                            <span className="user-lastname">
                                {user?.lastname}
                            </span>
                        </div>
                    </div>

                    <nav className="sidebar-nav">
                        <ul>
                            <li onClick={navigateToDashboard}>
                                <FontAwesomeIcon icon={faChartLine} />
                                <span>Dashboard</span>
                            </li>
                            <li className="active">
                                <FontAwesomeIcon icon={faBoxOpen} />
                                <span>Products</span>
                            </li>
                            <li onClick={handleLogout}>
                                <FontAwesomeIcon icon={faSignOutAlt} />
                                <span>Logout</span>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="dashboard-main">
                    <div className="add-product-container">
                        {/* Left Section */}
                        <div className="add-product-left">
                            <div className="add-product-header">
                                <h2>Edit Product</h2>
                                <p>Update the details of your product</p>
                            </div>
                            <div className="add-product-image">
                                <img
                                    src="/assets/edit-product.png"
                                    alt="Add Product"
                                    onError={e =>
                                        (e.target.src =
                                            "/src/assets/images/default-product.png")
                                    }
                                />
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="add-product-right">
                            <form
                                onSubmit={handleSubmit}
                                className="add-product-form"
                            >
                                <div className="form-top-section">
                                    <div className="form-left-fields">
                                        <div className="form-group">
                                            <label htmlFor="name">
                                                Product Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="price">
                                                Price (₱)
                                            </label>
                                            <input
                                                type="text"
                                                id="price"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-image-upload">
                                        <label htmlFor="image">
                                            Product Image
                                        </label>
                                        <div className="image-upload-box">
                                            {previewImage ? (
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="image-preview"
                                                />
                                            ) : (
                                                <div className="upload-placeholder">
                                                    <FontAwesomeIcon
                                                        icon={faUpload}
                                                        size="2x"
                                                    />
                                                    <span>Upload Photo</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                id="image"
                                                name="image"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-bottom-section">
                                    <div className="form-group">
                                        <label htmlFor="description">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="submit-button"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <FontAwesomeIcon
                                                icon={faSpinner}
                                                spin
                                            />
                                        ) : (
                                            "Update Product"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                </main>
            </div>
        </div>
    );
}
