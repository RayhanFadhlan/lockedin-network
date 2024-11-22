import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";

function App() {
  return (
    <Router>
      <main className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
