import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
    return (
        <Router>
            <div className="app d-flex flex-column min-vh-100">
                <Routes>
                    {/* Public Routes with Header */}
                    <Route
                        path="/"
                        element={
                            <>
                                <Header />
                                <Home />
                            </>
                        }
                    />

                    <Route
                        path="/login"
                        element={
                            <>
                                <Header />
                                <Auth />
                            </>
                        }
                    />

                    <Route
                        path="/register"
                        element={
                            <>
                                <Header />
                                <Auth />
                            </>
                        }
                    />

                    {/* Protected Routes without Header */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/products"
                        element={
                            <ProtectedRoute>
                                <Products />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/add-product"
                        element={
                            <ProtectedRoute>
                                <AddProduct />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/edit-product/:id"
                        element={
                            <ProtectedRoute>
                                <EditProduct />
                            </ProtectedRoute>
                        }
                    />

                    {/* Redirects */}
                    <Route path="/auth" element={<Navigate to="/login" />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

// Protected Route Component
function ProtectedRoute({ children }) {
    const token = localStorage.getItem("authToken");
    return token ? children : <Navigate to="/login" replace />;
}