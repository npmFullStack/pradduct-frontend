import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faBoxOpen,
    faChartLine,
    faSearch,
    faSignOutAlt,
    faEdit,
    faTrash,
    faSpinner,
    faPlus,
    faEllipsisVertical
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

export default function Products() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("community");
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showActions, setShowActions] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const [userResponse, productsResponse] = await Promise.all([
                    api.get("/user"),
                    api.get(
                        activeTab === "community"
                            ? "/products"
                            : "/user/products"
                    )
                ]);

                setUser(userResponse.data);

                const normalizedProducts = (productsResponse.data || []).map(
                    product => ({
                        ...product,
                        end_user: product.end_user || {
                            firstname: "Unknown",
                            lastname: "User"
                        },
                        price: parseFloat(product.price) || 0,
                        image:
                            product.image ||
                            "/src/assets/images/default-product.png",
                        description:
                            product.description || "No description available"
                    })
                );

                setProducts(normalizedProducts);
            } catch (err) {
                console.error("Fetch error:", err);
                if (err.response?.status === 401) {
                    localStorage.removeItem("authToken");
                    navigate("/login");
                } else {
                    setError(err.message || "Failed to load products");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [activeTab, navigate]);

    const handleLogout = async () => {
        try {
            await api.post("/logout");
            localStorage.removeItem("authToken");
            navigate("/login");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleAddProduct = () => {
        navigate("/add-product");
    };

    const handleDeleteProduct = async productId => {
        try {
            if (
                window.confirm("Are you sure you want to delete this product?")
            ) {
                await api.delete(`/products/${productId}`);
                setProducts(
                    products.filter(product => product.id !== productId)
                );
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete product");
        }
    };

    const toggleActions = productId => {
        setShowActions(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    const filteredProducts = products.filter(product => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            (product.name || "").toLowerCase().includes(searchTerm) ||
            (product.description || "").toLowerCase().includes(searchTerm)
        );
    });

    if (loading) {
        return (
            <div className="full-page-loading">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="full-page-error">
                <h3>Error loading products</h3>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <div className="header-title">
                    <FontAwesomeIcon icon={faBoxOpen} className="title-icon" />
                    <h1>Products</h1>
                </div>
            </header>

            <div className="dashboard-content-wrapper">
                <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
                    <div className="sidebar-logo">PrAdduct</div>
                    <div className="user-profile">
                        <img
                            src="/src/assets/images/user-icon.png"
                            alt="User"
                            className="user-avatar"
                            onError={e =>
                                (e.target.src =
                                    "/src/assets/images/default-avatar.png")
                            }
                        />
                        <div className="user-info">
                            <span className="user-firstname">
                                {user?.firstname || "User"}
                            </span>
                            <span className="user-lastname">
                                {user?.lastname || ""}
                            </span>
                        </div>
                    </div>
                    <nav className="sidebar-nav">
                        <ul>
                            <li onClick={() => navigate("/dashboard")}>
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

                <main className="dashboard-main">
                    <div className="search-add-container">
                        <div className="search-bar">
                            <div className="search-input">
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="search-icon"
                                />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={e =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        {!isMobile && (
                            <button
                                className="add-product-btn"
                                onClick={handleAddProduct}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                <span>Add Product</span>
                            </button>
                        )}
                    </div>

                    <div className="tab-bar-container">
                        <div className="tab-bar">
                            <button
                                className={`tab-button ${
                                    activeTab === "community" ? "active" : ""
                                }`}
                                onClick={() => setActiveTab("community")}
                            >
                                Community Products
                            </button>
                            <button
                                className={`tab-button ${
                                    activeTab === "your" ? "active" : ""
                                }`}
                                onClick={() => setActiveTab("your")}
                            >
                                Your Products
                            </button>
                        </div>
                    </div>

                    <div className="products-content">
                        {filteredProducts.length > 0 ? (
                            activeTab === "your" ? (
                                isMobile ? (
                                    <div className="products-grid">
                                        {filteredProducts.map(product => (
                                            <div
                                                key={product.id}
                                                className="product-card"
                                            >
                                                <div className="product-image-container">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="product-image"
                                                        onError={e =>
                                                            (e.target.src =
                                                                "/src/assets/images/default-product.png")
                                                        }
                                                    />
                                                    <div className="product-actions-container">
                                                        <button
                                                            className="action-menu-btn"
                                                            onClick={() =>
                                                                toggleActions(
                                                                    product.id
                                                                )
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faEllipsisVertical
                                                                }
                                                            />
                                                        </button>
                                                        {showActions[
                                                            product.id
                                                        ] && (
                                                            <div className="action-menu">
                                                                <button
                                                                    className="edit-btn"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/edit-product/${product.id}`
                                                                        )
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faEdit
                                                                        }
                                                                    />
                                                                    <span>
                                                                        Edit
                                                                    </span>
                                                                </button>
                                                                <button
                                                                    className="delete-btn"
                                                                    onClick={() =>
                                                                        handleDeleteProduct(
                                                                            product.id
                                                                        )
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faTrash
                                                                        }
                                                                    />
                                                                    <span>
                                                                        Delete
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <h3 className="product-name">
                                                    {product.name}
                                                </h3>
                                                <p className="product-description">
                                                    {product.description
                                                        .length > 100
                                                        ? `${product.description.substring(
                                                              0,
                                                              100
                                                          )}...`
                                                        : product.description}
                                                </p>
                                                <div className="product-footer">
                                                    <span className="product-uploader">
                                                        {
                                                            product.end_user
                                                                .firstname
                                                        }{" "}
                                                        {
                                                            product.end_user
                                                                .lastname
                                                        }
                                                    </span>
                                                    <span className="product-price">
                                                        
                                                        ₱{product.price.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <table className="products-table">
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Name</th>
                                                <th>Description</th>
                                                <th>Price</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProducts.map(product => (
                                                <tr key={product.id}>
                                                    <td>
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="table-product-image"
                                                            onError={e =>
                                                                (e.target.src =
                                                                    "/src/assets/images/default-product.png")
                                                            }
                                                        />
                                                    </td>
                                                    <td>{product.name}</td>
                                                    <td>
                                                        {product.description}
                                                    </td>
                                                    <td>
                                                        ₱
                                                        {product.price.toFixed(
                                                            2
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="table-actions">
                                                            <button
                                                                className="edit-btn"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/edit-product/${product.id}`
                                                                    )
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faEdit
                                                                    }
                                                                />
                                                                <span>
                                                                    Edit
                                                                </span>
                                                            </button>
                                                            <button
                                                                className="delete-btn"
                                                                onClick={() =>
                                                                    handleDeleteProduct(
                                                                        product.id
                                                                    )
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faTrash
                                                                    }
                                                                />
                                                                <span>
                                                                    Delete
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )
                            ) : (
                                <div className="products-grid">
                                    {filteredProducts.map(product => (
                                        <div
                                            key={product.id}
                                            className="product-card"
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="product-image"
                                                onError={e =>
                                                    (e.target.src =
                                                        "/src/assets/images/default-product.png")
                                                }
                                            />
                                            <h3 className="product-name">
                                                {product.name}
                                            </h3>
                                            <p className="product-description">
                                                {product.description.length >
                                                100
                                                    ? `${product.description.substring(
                                                          0,
                                                          100
                                                      )}...`
                                                    : product.description}
                                            </p>
                                            <div className="product-footer">
                                                <span className="product-uploader">
                                                    {product.end_user.firstname}{" "}
                                                    {product.end_user.lastname}
                                                </span>
                                                <span className="product-price">
                                                    ₱{product.price.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="no-products">
                                <FontAwesomeIcon icon={faBoxOpen} size="3x" />
                                <p>No products found</p>
                                {searchQuery && (
                                    <button
                                        className="clear-search"
                                        onClick={() => setSearchQuery("")}
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {isMobile && (
                <button className="mobile-add-btn" onClick={handleAddProduct}>
                    <FontAwesomeIcon icon={faPlus} size="2x" />
                </button>
            )}
        </div>
    );
}
