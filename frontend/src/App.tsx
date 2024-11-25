import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import SignUpPage from "./pages/auth/signup";
import LoginPage from "./pages/auth/login";
import { Toaster } from "react-hot-toast";
import Invitations from "./pages/connection/invitations";

function App() {
  return (
    <Router>
        <main className="container mx-auto px-4 bg-">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/invitation" element={<Invitations/>} />
            </Routes>
            <Toaster/>
        </main>
    </Router>
  );
}

export default App
