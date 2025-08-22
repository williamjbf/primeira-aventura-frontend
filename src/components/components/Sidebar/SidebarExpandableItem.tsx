'use client'

import { FaChevronDown } from "react-icons/fa";
import {useMemo, useState} from "react";

type Key = string | number;

interface SidebarExpandableItemProps<T = unknown> {
  icon: React.ReactNode;
  label: string;
  items: T[];
  maxVisible?: number;
  // Mapeadores para manter compatibilidade e flexibilidade
  getItemId?: (item: T, index: number) => Key;
  getItemLabel?: (item: T, index: number) => string;
  onItemClick?: (id: Key, item: T) => void;
}

const SidebarExpandableItem = <T,>({
  icon,
  label,
  items,
  maxVisible = 5,
  getItemId,
  getItemLabel,
  onItemClick,
}: SidebarExpandableItemProps<T>) => {
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const resolvedGetItemId = useMemo(
    () =>
      getItemId ||
      ((item: any, index: number) =>
        item?.id ?? `${label}-${index}`),
    [getItemId, label]
  );

  const resolvedGetItemLabel = useMemo(
    () =>
      getItemLabel ||
      ((item: any) =>
        typeof item === "string" ? item : item?.titulo ?? String(item)),
    [getItemLabel]
  );

  const visibleItems = useMemo(() => {
    if (!open) return [];
    return showAll ? items : items.slice(0, maxVisible);
  }, [open, showAll, items, maxVisible]);

  const listId = `${label.replace(/\s+/g, "-").toLowerCase()}-list`;

  return (
    <div>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-3 py-2 hover:bg-gray-800 rounded text-white"
        aria-expanded={open}
        aria-controls={listId}
      >
        <span className="flex items-center gap-3">
          {icon}
          {label}
        </span>
        <FaChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          id={listId}
          className="ml-6 mt-1 space-y-1 max-h-48 overflow-y-auto pr-1"
        >
          {visibleItems.map((item, index) => {
            const id = resolvedGetItemId(item, index);
            const text = resolvedGetItemLabel(item, index);
            return (
              <li
                key={id}
                className="text-sm text-gray-300 hover:text-white cursor-pointer"
                tabIndex={0}
                role="button"
                onClick={() => onItemClick?.(id, item)}
                title={text}
              >
                {text}
              </li>
            );
          })}

          {items.length > maxVisible && (
            <li
              className="text-sm text-blue-400 hover:underline cursor-pointer"
              tabIndex={0}
              onClick={() => setShowAll((s) => !s)}
            >
              {showAll ? "Ver menos" : `+ Ver mais`}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SidebarExpandableItem;
