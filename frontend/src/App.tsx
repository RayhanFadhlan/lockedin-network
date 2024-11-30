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
import Chat from "./pages/chat/chat";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { AuthProvider } from "./contexts/authProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data.type === "NOTIFICATION") {
        console.log(event.data.body);
        toast(event.data.body, {
          icon: "🔔",
          duration: 4000,
          position: "top-right",
          style: {
            padding: "16px",
          },
        });
      }
    });
  }, []);
  return (
    <Router>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="container mx-auto px-4 flex-grow mt-[80px]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/invitation" element={<Invitations />} />
              <Route path="/connections/:user_id" element={<Connections />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/profile/:user_id" element={<Profile />} />
              <Route path="/profile/edit/:user_id" element={<EditProfile />} />
              <Route path="/messaging" element={<Chat />} />
            </Routes>
            <Toaster />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  </Router>
  );
}

export default App;
