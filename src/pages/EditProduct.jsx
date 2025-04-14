import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
    const navigate = useNavigate();

useEffect(() => {
    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/products/${id}`);
            const product = response.data.product; // Note the .product access
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                image: null,
                currentImage: product.image || "" // Now contains full URL
            });
        } catch (err) {
            console.error("Fetch product error:", err);
            setError(err.response?.data?.message || "Failed to load product");
        } finally {
            setLoading(false);
        }
    };

    fetchProduct();
}, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }
            formDataToSend.append('_method', 'PUT');

            const response = await api.post(`/products/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/products');
        } catch (err) {
            console.error("Update product error:", err);
            setError(err.response?.data?.message || "Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.name) {
        return (
            <div className="loading-container">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Loading product details...</p>
            </div>
        );
    }

    return (
        <div className="product-form-container">
            <button 
                className="back-button"
                onClick={() => navigate(-1)}
            >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
            </button>

            <h2>Edit Product</h2>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label htmlFor="name">Product Name</label>
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
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price ($)</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image">Product Image</label>
                    {formData.currentImage && (
                        <div className="current-image">
                            <img 
                                src={formData.currentImage} 
                                alt="Current product" 
                                className="product-thumbnail"
                            />
                            <span>Current Image</span>
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

                <button type="submit" disabled={loading}>
                    {loading ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                        "Update Product"
                    )}
                </button>
            </form>
        </div>
    );
}