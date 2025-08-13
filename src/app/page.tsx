"use client";

import Sidebar from "@/components/components/Sidebar/Sidebar";
import {FaSearch, FaUserCircle} from "react-icons/fa";
import {useEffect, useRef, useState} from "react";

export default function Home() {

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sidebarWidth = "16rem"

  return (
    <div className="flex min-h-screen bg-gray-800">
      <Sidebar />

      <main className="flex-1 overflow-y-auto max-w-7xl mx-auto px-6 py-8 bg-gray-800 rounded-l-lg">
        {/* Header fixo após a sidebar */}
        <div
          className={`fixed top-0 z-30 bg-gray-800 transition-border duration-300 ${
            scrolled ? "border-b border-gray-700" : ""
          }`}
          style={{
            left: sidebarWidth,
            right: 0,
          }}
        >
          <div className="flex items-center justify-end h-12 px-6 gap-4 max-w-7xl mx-auto">
            <div className="relative w-48">
              <input
                type="search"
                placeholder="Search"
                className="w-full pl-8 pr-3 py-1.5 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
            <button className="text-gray-700 hover:text-green-600 focus:outline-none">
              <FaUserCircle size={28} />
            </button>
          </div>
        </div>

        {/* Espaço para o header fixo */}
        <div className="pt-16">
          <section>
            <h1 className="text-3xl font-bold">Bem-vindo à Primeira Aventura!</h1>
            <p className="mt-4 text-gray-300">
              Aqui você pode explorar suas campanhas, mesas e muito mais.
            </p>
            {/* Conteúdo extra para scroll */}
            <div style={{ height: "1500px" }} />
          </section>
        </div>
      </main>
    </div>
  );
}
