import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/Header.css";
import "./assets/css/Footer.css";
import "./assets/css/Home.css";

export default function App() {
    return (
        <Router>
            <div className="app d-flex flex-column min-vh-100">
                <div className="d-flex flex-grow-1">
                    <Header />
                    <main className="flex-grow-1">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/auth" element={<Auth />} />
                        </Routes>
                    </main>
                </div>
                <Footer />
            </div>
        </Router>
    );
}
