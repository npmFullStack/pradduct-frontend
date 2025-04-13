import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/Header.css";

export default function Header() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="header">
            <div className="logo">
              PrAdduct
            </div>

            {/* Hamburger Menu Icon (Mobile Only) */}
            <div className="hamburger" onClick={toggleMenu}>
                <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
                <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
                <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
            </div>

            {/* Navigation Links */}
            <nav className={`nav-links ${isMenuOpen ? "active" : ""}`}>
                <Link
                    to="/"
                    className={`nav-link ${
                        location.pathname === "/" ? "active" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Home
                </Link>
                <Link
                    to="/auth"
                    className={`nav-link get-started-btn ${
                        location.pathname === "/auth" ? "active" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Get Started
                </Link>
            </nav>
        </div>
    );
}
