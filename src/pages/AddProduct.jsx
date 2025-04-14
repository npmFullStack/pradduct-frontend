import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function AddProduct() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        image: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

            const response = await api.post('/products', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/products');
        } catch (err) {
            console.error("Add product error:", err);
            setError(err.response?.data?.message || "Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-form-container">
            <button 
                className="back-button"
                onClick={() => navigate(-1)}
            >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
            </button>

            <h2>Add New Product</h2>
            
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
                        "Add Product"
                    )}
                </button>
            </form>
        </div>
    );
}