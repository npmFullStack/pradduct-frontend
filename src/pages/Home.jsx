import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../assets/css/Home.css";

// Animation variants
const sectionVariants = {
    offscreen: {
        opacity: 0,
        y: 50
    },
    onscreen: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8
        }
    }
};

const imageVariants = {
    offscreen: {
        opacity: 0,
        x: -100
    },
    onscreen: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            duration: 0.8
        }
    }
};

const reverseImageVariants = {
    offscreen: {
        opacity: 0,
        x: 100
    },
    onscreen: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            duration: 0.8
        }
    }
};

const textVariants = {
    offscreen: {
        opacity: 0,
        y: 30
    },
    onscreen: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const Home = () => {
    return (
        <main className="home-main">
            {/* Section 1 */}
            <motion.section
                className="home-section bg-section-1"
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="home-container">
                    <div className="content-wrapper">
                        <motion.div
                            className="image-container"
                            variants={imageVariants}
                        >
                            <img
                                src="/src/assets/images/section-1.png"
                                alt="Product showcase platform"
                            />
                        </motion.div>
                        <motion.div
                            className="text-container"
                            variants={textVariants}
                        >
                            <h1 className="title">Add Your Products</h1>
                            <p className="subtitle">
                                Join our community of creators today
                            </p>
                            <div className="button-group">
                                <Link to="/auth" className="cta-button primary">
                                    Sign Up Free
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Section 2 */}
            <motion.section
                className="home-section bg-section-2"
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="home-container">
                    <div className="content-wrapper reverse">
                        <motion.div
                            className="image-container"
                            variants={reverseImageVariants}
                        >
                            <img
                                src="/src/assets/images/section-2.png"
                                alt="Product management features"
                            />
                        </motion.div>
                        <motion.div
                            className="text-container"
                            variants={textVariants}
                        >
                            <h1 className="title">Amazing Features</h1>
                            <p className="subtitle">
                                Simple tools to manage and showcase your
                                products
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Section 3 */}
            <motion.section
                className="home-section bg-section-1"
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="home-container">
                    <div className="content-wrapper">
                        <motion.div
                            className="image-container"
                            variants={imageVariants}
                        >
                            <img
                                src="/src/assets/images/section-3.png"
                                alt="PrAdduct community platform"
                            />
                        </motion.div>
                        <motion.div
                            className="text-container"
                            variants={textVariants}
                        >
                            <h1 className="title">PrAdduct</h1>
                            <p className="subtitle">
                                Bring your products to life, connect with an
                                engaged audience, and celebrate your creative
                                success. Your spotlight starts here.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>
        </main>
    );
};

export default Home;
