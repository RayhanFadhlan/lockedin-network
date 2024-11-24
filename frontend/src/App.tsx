import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import SignUpPage from "./pages/auth/signup";

function App() {
  return (
    <Router>
        <main className="container mx-auto px-4">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUpPage />} />
            </Routes>
        </main>
    </Router>
  );
}

export default App;
