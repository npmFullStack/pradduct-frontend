import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../assets/css/Auth.css";

export default function Auth() {
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        // Clear error when user types
        if (errors[id]) {
            setErrors(prev => ({
                ...prev,
                [id]: null
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const endpoint = isLogin ? '/login' : '/register';
            const payload = isLogin 
                ? { 
                    email: formData.email, 
                    password: formData.password 
                }
                : {
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.confirmPassword
                };

            const response = await fetch(`http://localhost:8000/api${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            // Store token and user data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to dashboard or home page
            navigate('/');
        } catch (error) {
            if (error.errors) {
                setErrors(error.errors);
            } else {
                setErrors({ general: error.message || 'Something went wrong!' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Animation variants (unchanged from your original)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const formSwitchVariants = {
        hidden: { x: -30, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <motion.section
            className="auth-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="auth-container">
                {/* Left Column - Image & Message */}
                {!isLogin ? (
                    <motion.div
                        className="auth-left"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <div className="auth-message">
                            <motion.h2 variants={itemVariants}>
                                Join Our Community
                            </motion.h2>
                            <motion.p variants={itemVariants}>
                                Create your account and showcase your products
                            </motion.p>
                        </div>
                        <motion.div
                            className="auth-image-container"
                            variants={itemVariants}
                        >
                            <img
                                src="/src/assets/images/signup.png"
                                alt="Signup illustration"
                            />
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        className="auth-left"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <div className="auth-message">
                            <motion.h2 variants={itemVariants}>
                                Welcome Back!
                            </motion.h2>
                            <motion.p variants={itemVariants}>
                                Login to continue your creative journey
                            </motion.p>
                        </div>
                        <motion.div
                            className="auth-image-container"
                            variants={itemVariants}
                        >
                            <img
                                src="/src/assets/images/login.png"
                                alt="Login illustration"
                            />
                        </motion.div>
                    </motion.div>
                )}

                {/* Right Column - Form */}
                <motion.div
                    className="auth-right"
                    initial="hidden"
                    animate="visible"
                    variants={formSwitchVariants}
                    key={isLogin ? "login" : "signup"}
                >
                    {errors.general && (
                        <div className="auth-error">
                            {errors.general}
                        </div>
                    )}

                    {!isLogin ? (
                        <motion.form 
                            onSubmit={handleSubmit}
                            variants={containerVariants}
                        >
                            <motion.h2 variants={itemVariants}>
                                Sign Up
                            </motion.h2>

                            <motion.div
                                className="name-fields"
                                variants={itemVariants}
                            >
                                <div className="form-group">
                                    <label htmlFor="firstname">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstname"
                                        placeholder="First name"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                    />
                                    {errors.firstname && <span className="error-message">{errors.firstname[0]}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastname">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastname"
                                        placeholder="Last name"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                    />
                                    {errors.lastname && <span className="error-message">{errors.lastname[0]}</span>}
                                </div>
                            </motion.div>

                            <motion.div
                                className="form-group"
                                variants={itemVariants}
                            >
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <span className="error-message">{errors.email[0]}</span>}
                            </motion.div>

                            <motion.div
                                className="name-fields"
                                variants={itemVariants}
                            >
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Create password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && <span className="error-message">{errors.password[0]}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        placeholder="Confirm password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    {errors.password_confirmation && (
                                        <span className="error-message">{errors.password_confirmation[0]}</span>
                                    )}
                                </div>
                            </motion.div>

                            <motion.button
                                type="submit"
                                className="auth-button"
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : 'Sign Up'}
                            </motion.button>

                            <motion.p
                                className="auth-switch"
                                variants={itemVariants}
                            >
                                Already have an account?{" "}
                                <span onClick={() => {
                                    setIsLogin(true);
                                    setErrors({});
                                }}>
                                    Login
                                </span>
                            </motion.p>
                        </motion.form>
                    ) : (
                        <motion.form 
                            onSubmit={handleSubmit}
                            variants={containerVariants}
                        >
                            <motion.h2 variants={itemVariants}>Login</motion.h2>

                            <motion.div
                                className="form-group"
                                variants={itemVariants}
                            >
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <span className="error-message">{errors.email[0]}</span>}
                            </motion.div>

                            <motion.div
                                className="form-group"
                                variants={itemVariants}
                            >
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {errors.password && <span className="error-message">{errors.password[0]}</span>}
                            </motion.div>

                            <motion.button
                                type="submit"
                                className="auth-button"
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </motion.button>

                            <motion.p
                                className="auth-switch"
                                variants={itemVariants}
                            >
                                Doesn't have an account?{" "}
                                <span onClick={() => {
                                    setIsLogin(false);
                                    setErrors({});
                                }}>
                                    Sign Up
                                </span>
                            </motion.p>
                        </motion.form>
                    )}
                </motion.div>
            </div>
        </motion.section>
    );
}