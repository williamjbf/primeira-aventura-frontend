"use client";

import Image from "next/image";
import { FaUser } from "react-icons/fa";

interface TableCardProps {
  imageUrl: string;
  title: string;
  system: string;
  gmName: string;
  timeAgo: string;
  onClick?: () => void;
  className?: string;
}

const NewTableCard: React.FC<TableCardProps> = ({
                                               imageUrl,
                                               title,
                                               system,
                                               gmName,
                                               timeAgo,
                                               onClick,
                                               className = "",
                                             }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700/60 transition-colors cursor-pointer group ${className}`}
    >
      {/* Thumbnail */}
      <div className="relative h-14 w-10 flex-shrink-0">
        <Image
          src={`http://localhost:8080${imageUrl}` || "https://placehold.co/600x400"}
          alt={`${title} thumbnail`}
          unoptimized
          fill
          className="object-cover rounded"
          sizes="40px"
        />
      </div>

      {/* Infos à direita */}
      <div className="flex flex-col text-sm w-full">
        {/* Título com tooltip */}
        <span className="relative max-w-full">
          <span className="text-white font-semibold truncate leading-tight block">
            {title}
          </span>
          <span className="absolute hidden group-hover:block bg-gray-900 text-white text-xs rounded-md px-3 py-1 whitespace-normal z-10 max-w-xs shadow-lg top-full mt-1">
            {title}
          </span>
        </span>

        {/* Sistema */}
        <span className="text-gray-400 text-xs truncate">{system}</span>

        {/* GM e tempo */}
        <div className="flex items-center justify-between text-gray-500 text-xs mt-0.5">
          <span className="flex items-center gap-1">
            <FaUser className="text-xs" />
            {gmName}
          </span>
          <span className="whitespace-nowrap">{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};

export default NewTableCard;
