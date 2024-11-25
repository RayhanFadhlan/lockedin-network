import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Footer  from "./components/footer";
import SignUpPage from "./pages/auth/signup";
import LoginPage from "./pages/auth/login";
import { Toaster } from "react-hot-toast";
import Invitations from "./pages/connection/invitations";
import Connections from "./pages/connection/connections";

function App() {
  return (
    <Router>
        <main className="container mx-auto px-4 bg-">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/invitation" element={<Invitations/>} />
            <Route path="/connections/:userId" element={<Connections/>} />
            </Routes>
            <Toaster/>
        </main>
        <Footer />
    </Router>
  );
}

export default App
