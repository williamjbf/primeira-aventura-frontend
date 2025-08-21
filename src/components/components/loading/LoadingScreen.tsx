"use client";

import Image from "next/image";
import { useMemo } from "react";

export default function LoadingScreen() {
  // 8 bolinhas igualmente espaçadas na órbita
  const dots = useMemo(() => Array.from({ length: 8 }, (_, i) => i), []);
  const radius = 90; // raio da órbita em px

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900">
      <div className="relative" style={{ width: 220, height: 220 }}>
        {/* Imagem central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/dragon.png"
            alt="Dragão"
            width={140}
            height={140}
            priority
            className="drop-shadow-lg"
          />
        </div>

        {/* Container com rotação contínua */}
        <div className="absolute inset-0 animate-spin slow">
          {dots.map((i) => {
            const angle = (i * 360) / dots.length;
            return (
              <span
                key={i}
                className="absolute block rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.6)]"
                style={{
                  width: 10,
                  height: 10,
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${angle}deg) translate(${radius}px)`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Texto */}
      <p className="absolute bottom-[15%] text-gray-300 text-sm md:text-base">
        Carregando os dados do aventureiro...
      </p>

      {/* Ajuste de velocidade da rotação */}
      <style jsx>{`
        .slow {
          animation-duration: 2.8s;
          animation-timing-function: linear;
        }
      `}</style>
    </div>
  );
}
