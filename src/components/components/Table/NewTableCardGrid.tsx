"use client";

import NewTableCard from "@/components/components/Table/NewTableCard";
import Link from "next/link";

interface TableCardGridProps {
  tables: {
    id: string
    imageUrl: string;
    title: string;
    system: string;
    gmName: string;
    timeAgo: string;
  }[];
}

const NewTableCardGrid: React.FC<TableCardGridProps> = ({ tables }) => {
  // Mantém distribuição mais natural em grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {tables.map((table, idx) => (
        <div key={idx} className="bg-gray-800 rounded-lg hover:shadow-lg transition-shadow">
          <Link href={`/table/${table.id}`}>
            <NewTableCard {...table} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default NewTableCardGrid;
