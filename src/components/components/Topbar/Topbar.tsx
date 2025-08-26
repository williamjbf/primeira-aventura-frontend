"use client";


import {FaSearch, FaUserCircle} from "react-icons/fa";
import {useAuth} from "@/contexts/AuthContext";
import {useRouter} from "next/navigation";
import {useRef, useState} from "react";

interface TopbarProps {
  scrolled: boolean;
}

const Topbar: React.FC<TopbarProps> = ({scrolled}: { scrolled: boolean }) => {

  const {user, logoutUser} = useAuth();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleUserClick = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/table/search?q=${encodeURIComponent(search)}`);
  };

  const handleLogin = () => {
    setMenuOpen(false);
    router.push("/login"); // ajusta para sua rota de login
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logoutUser();
    router.replace("/"); // volta para home depois de deslogar
  };

  return (
    <header
      className={`fixed top-0 z-30 transition-border duration-300 ${
        scrolled ? "bg-gray-900 border-b border-gray-700" : ""
      } w-full`}
    >
      <div className="flex items-center justify-end h-12 px-6 gap-4 max-w-7xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button type="submit">
            <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
          </button>
        </form>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={handleUserClick}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <FaUserCircle size={28}/>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
              {!user ? (
                <button
                  onClick={handleLogin}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;