import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import SignUpPage from "./pages/auth/signup";
import LoginPage from "./pages/auth/login";
import { Toaster } from "react-hot-toast";
import Invitations from "./pages/connection/invitations";
import Connections from "./pages/connection/connections";
import UserList from "./pages/connection/user-list";
import Profile from "./pages/profile/profile";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 flex-grow mt-[130px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/invitation" element={<Invitations />} />
            <Route path="/connections/:userId" element={<Connections />} />
            <Route path="/users" element={<UserList/>} />
            <Route path="/profile" element={<Profile />} /> {/* nanti ganti routenya pake id  */}
          </Routes>
          <Toaster />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
