"use client";

import Sidebar from "@/components/components/Sidebar/Sidebar";
import {useEffect, useState} from "react";
import Topbar from "@/components/components/Topbar/Topbar";
import RecentTablesSection from "@/components/components/home/RecentTablesSection";
import CreateAdventureSection from "@/components/components/home/CreateAdventureSection";
import TaggedCarouselSection from "@/components/components/home/TaggedCarouselSection";

export default function Home() {

  const [scrolled, setScrolled] = useState(false);
  const tags = ["Fantasia", "Terror", "Aventura", "Mistério", "Cyberpunk", "Ação"];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar/>

      <main className={`flex-1 overflow-y-auto ml-64 bg-gray-900 rounded-l-lg`}>

        {/* Hero com imagem + gradient */}
        <div className="relative h-[400px] w-full-64">
          <div
            className="absolute inset-0 bg-cover bg-top"
            style={{backgroundImage: "url('/banner.jpeg')"}}
          />

          {/* Overlay com gradient para sumir na cor da home */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-gray-900"/>
        </div>

        {/* Header fixo após a sidebar */}
        <Topbar scrolled={scrolled}/>

        {/* Espaço para o header fixo */}
        <div className="pt-16 px-6 max-w-7xl mx-auto space-y-10">

          <RecentTablesSection/>

          <CreateAdventureSection/>

          <div className="pb-20">
            {tags.map((tag) => (
              <TaggedCarouselSection key={tag} tag={tag}/>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}