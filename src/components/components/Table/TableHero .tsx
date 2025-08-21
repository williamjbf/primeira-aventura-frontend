// components/TableHero.tsx
"use client";
import Image from "next/image";

interface TableHeroProps {
  imageUrl: string;
  height?: number; // altura opcional
}

export default function TableHero({imageUrl, height = 400}: TableHeroProps) {
  return (
    <div className="relative w-full" style={{height}}>
      <Image
        src={imageUrl}
        alt="Imagem da mesa"
        fill
        className="object-cover"
        unoptimized
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-gray-900"/>
    </div>
  );
}