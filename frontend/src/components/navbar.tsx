import {
  BellIcon,
  CircleUserRound,
  House,
  Menu,
  MessageSquareText,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/authProvider";
import { Button } from "./ui/button";
// import Cookies from "js-cookie";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, active }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(to);
  };

  return (
    <button
      onClick={handleNavigate}
      className={`flex flex-col items-center text-sm ${
        active ? "text-gray-800" : "text-gray-500"
      } hover:text-black focus:outline-none`}
    >
      <div className="w-6 h-6">{icon}</div>
      <span className=" text-xs">{label}</span>
    </button>
  );
};

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const { user } = useAuth();
  // const handleLogout = () => {
  //   Cookies.remove("token");
  //   logout();
  // };

  return (
    <nav className="bg-white border-b border-gray-300 top-0 fixed w-full h-[55px] z-50">
      <div className="container mx-auto px-4 h-full max-w-full sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw]">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center">
            <img src="/linkedin.svg" alt="Logo" className="w-10 h-10 " />
          </div>

          <div className="hidden sm:flex items-center gap-8">
            <NavItem icon={<House />} label="Home" to="/" />
            <NavItem icon={<Users />} label="People" to="/users" />
            {user ? (
              <>
                <NavItem
                  icon={<MessageSquareText />}
                  label="Messaging"
                  to="/messaging"
                />
                <NavItem
                  icon={<BellIcon />}
                  label="Notifications"
                  to="/notifications"
                />
                <NavItem icon={<CircleUserRound />} label="Me" to="/profile" />
              </>
            ) : (
              <>
                <Button
                  variant={"secondary"}
                  className="text-sm"
                  onClick={() => navigate("/signup")}
                >
                  Join now
                </Button>
                <Button
                  variant={"outline"}
                  className="text-sm"
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </Button>
              </>
            )}
          </div>

          <button className="sm:hidden focus:outline-none" onClick={toggleMenu}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-white shadow-md z-40">
          <div className="flex flex-col items-center gap-4 p-4">
            <NavItem icon={<House />} label="Home" to="/" />
            <NavItem icon={<Users />} label="My Network" to="/users" />
            <NavItem
              icon={<MessageSquareText />}
              label="Messaging"
              to="/messaging"
            />
            <NavItem
              icon={<BellIcon />}
              label="Notifications"
              to="/notifications"
            />
            <NavItem icon={<CircleUserRound />} label="Me" to="/profile" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
