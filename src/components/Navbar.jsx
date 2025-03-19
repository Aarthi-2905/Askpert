import { useState } from "react";
import { FiMenu, FiX, FiMessageSquare, FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <button onClick={toggleSidebar} className="text-white text-2xl">
        <FiMenu />
      </button>
      <div className="flex gap-6">
        <Link to="/history" className="flex items-center gap-1">
          <FiClock className="text-xl" /> History
        </Link>
        <Link to="/new-chat" className="flex items-center gap-1">
          <FiMessageSquare className="text-xl" /> New Chat
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
