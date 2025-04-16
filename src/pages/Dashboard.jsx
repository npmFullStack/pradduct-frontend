import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faChartLine,
    faBoxOpen,
    faSignOutAlt,
    faSpinner
} from "@fortawesome/free-solid-svg-icons";
import "../assets/css/Dashboard.css";

const api = axios.create({
    baseURL: "http://localhost:8001/api/v1",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        userProducts: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userResponse, statsResponse] = await Promise.all([
                    api.get("/user"),
                    api.get("/stats")
                ]);

                setUser(userResponse.data);
                setStats(statsResponse.data);
                localStorage.setItem("user", JSON.stringify(userResponse.data));
            } catch (err) {
                console.error("Fetch error:", err);
                if (err.response?.status === 401) {
                    handleUnauthorized();
                } else {
                    setError(
                        err.response?.data?.message || "Failed to fetch dashboard data"
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        const token = localStorage.getItem("authToken");
        if (!token) {
            handleUnauthorized();
        } else {
            fetchData();
        }
    }, [navigate]);

    const handleUnauthorized = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleLogout = async () => {
        try {
            await api.post("/logout");
            handleUnauthorized();
        } catch (err) {
            console.error("Logout failed:", err);
            setError("Logout failed. Please try again.");
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const navigateToProducts = () => {
        navigate("/products");
    };

    if (loading) {
        return (
            <div className="full-page-loading">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="full-page-error">
                <h3>Error loading dashboard</h3>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
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
                    <FontAwesomeIcon
                        icon={faChartLine}
                        className="title-icon"
                    />
                    <h1>Dashboard</h1>
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
                            onError={(e) => e.target.src = "/src/assets/images/default-avatar.png"}
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
                            <li className="active">
                                <FontAwesomeIcon icon={faChartLine} />
                                <span>Dashboard</span>
                            </li>
                            <li onClick={navigateToProducts}>
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
                    <div className="welcome-card">
                        <h2>Welcome back, {user?.firstname}!</h2>
                        <p>Here's what's happening with your products today</p>
                    </div>

                    <div className="stats-cards">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FontAwesomeIcon icon={faBoxOpen} />
                            </div>
                            <div className="stat-content">
                                <div className="stat-number">
                                    {stats.totalProducts}
                                </div>
                                <div className="stat-link">
                                    Community Products
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <FontAwesomeIcon icon={faBoxOpen} />
                            </div>
                            <div className="stat-content">
                                <div className="stat-number">
                                    {stats.userProducts}
                                </div>
                                <div className="stat-link">Your Products</div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}