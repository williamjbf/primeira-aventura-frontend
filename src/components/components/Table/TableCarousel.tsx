"use client";

import {useKeenSlider} from "keen-slider/react";
import {useEffect} from "react";
import {SummaryTableCard} from "@/components/components/Table/SummaryTableCard";

interface Table {
  imagem: string;
  titulo: string;
  resumo: string;
  sistema: string;
  organizador: string;
  tags: string[];
}

interface TablesCarouselProps {
  tables: Table[];
}

export const TableCarousel: React.FC<TablesCarouselProps> = ({tables}) => {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 4.5,
      spacing: 16,
    },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: {perView: 3, spacing: 12},
      },
      "(max-width: 768px)": {
        slides: {perView: 2, spacing: 8},
      },
      "(max-width: 480px)": {
        slides: {perView: 1, spacing: 8},
      },
    },
  });

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update();
    }
  }, [tables, instanceRef]);

  return (
    <div ref={sliderRef} className="keen-slider">
      {tables.map((mesa, i) => (
        <div key={i} className="keen-slider__slide">
          <SummaryTableCard {...mesa} />
        </div>
      ))}
    </div>
  );
};