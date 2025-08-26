import { useState, useRef, useEffect } from "react";

export default function TagSelector({ allTags, filters, handleTagsChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTag = (tag: string) => {
    if (filters.tags.includes(tag)) {
      handleTagsChange(filters.tags.filter((t) => t !== tag));
    } else {
      handleTagsChange([...filters.tags, tag]);
    }
  };

  return (
    <div className="relative w-64" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 rounded-xl bg-gray-700 text-white text-left focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        {filters.tags.length > 0 ? filters.tags.join(", ") : "Gêneros"}
      </button>

      {open && (
        <div className="absolute mt-1 w-full bg-gray-700 border border-gray-600 rounded-xl max-h-60 overflow-y-auto z-10">
          {allTags.map((tag) => (
            <div
              key={tag.id}
              onClick={() => toggleTag(tag.nome)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-600 ${
                filters.tags.includes(tag.nome) ? "bg-gray-600" : ""
              }`}
            >
              {tag.nome}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
