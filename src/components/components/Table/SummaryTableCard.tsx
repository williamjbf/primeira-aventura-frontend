import Image from "next/image";

interface SummaryTableCardProps {
  imagem: string;
  titulo: string;
  resumo: string;
  sistema: string;
  narrador: string;
  tags: {
    id: number;
    nome: string;
  };
}

export const SummaryTableCard: React.FC<SummaryTableCardProps> = (
  {
    imagem,
    titulo,
    resumo,
    sistema,
    narrador,
    tags,
  }) => {
  return (
    <div className="relative w-64 h-80 rounded-xl overflow-hidden shadow-lg group snap-start">
      {/* Imagem */}
      <Image
        src={imagem}
        alt={titulo}
        fill
        unoptimized
        className="object-cover transition-transform duration-500 group-hover:scale-105"/>

      {/* Título fixo */}
      <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-3 text-lg font-semibold">
        {titulo}
      </div>

      {/* Overlay no hover */}
      <div
        className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col">
        {/* Resumo com scroll */}
        <div className="p-4 flex-1 overflow-y-auto text-sm text-gray-200">
          {resumo}
        </div>

        {/* Informações extras */}
        <div className="p-4 pb-10 border-t border-white/20 text-sm space-y-2">
          <div>
            <span className="font-bold">Sistema:</span> {sistema}
          </div>
          <div>
            <span className="font-bold">Organizador:</span> {narrador}
          </div>
          <div className="absolute flex gap-2 z-20">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 text-xs bg-gray-700 text-white rounded"
              > {tag.nome}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}