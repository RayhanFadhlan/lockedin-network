import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import SignUp from "./pages/auth/signup";
import Login from "./pages/auth/login";
import { Toaster } from "react-hot-toast";
import Invitations from "./pages/connection/invitations";
import Connections from "./pages/connection/connections";
import UserList from "./pages/connection/user-list";
import Profile from "./pages/profile/profile";
import EditProfile from "./pages/profile/edit-profile";
import { useEffect } from "react";
import { toast } from "react-hot-toast";


function App() {
  useEffect(() => {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.type === 'NOTIFICATION') {
        console.log(event.data.body);
        toast(event.data.body, {
          icon: '🔔',
          duration: 4000,
          position: 'top-right',
          style: {
            padding: '16px',
          },
     
        });
      }
    });
  }, []);
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 flex-grow mt-[130px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/invitation" element={<Invitations />} />
            <Route path="/connections/:user_id" element={<Connections />} />
            <Route path="/users" element={<UserList/>} />
            <Route path="/profile/:user_id" element={<Profile />} /> {/* nanti ganti routenya pake id  */}
            <Route path="/profile/edit/:user_id" element={<EditProfile />} /> {/* nanti ganti routenya pake id  */}
          </Routes>
          <Toaster />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
