import { useMemo, useState } from "react";
import { IoReloadCircle, IoSearch, IoClose } from "react-icons/io5";
import type {
  OpenApiDocument,
  OpenApiOperation,
} from "./interfaces/swagger.interface";
import TagGroup from "./TagGroup";

interface SidebarProps {
  jsonData: OpenApiDocument;
  selectedPath: string | null;
  selectedMethod: string | null;
  onSelect: (path: string, method: string) => void;
  onReload: () => void;
  open: boolean;
  onClose: () => void;
}

export default function SidebarPaths({
  jsonData,
  selectedPath,
  selectedMethod,
  onSelect,
  onReload,
  open,
  onClose,
}: SidebarProps) {
  const [search, setSearch] = useState("");

  const groupedPaths = useMemo(() => {
    const groups: Record<
      string,
      { path: string; method: string; operation: OpenApiOperation }[]
    > = {};
    const term = search.trim().toLowerCase();

    Object.entries(jsonData.paths).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, operation]) => {
        if (
          term &&
          !path.toLowerCase().includes(term) &&
          !operation.summary?.toLowerCase().includes(term) &&
          !method.toLowerCase().includes(term)
        ) {
          return;
        }
        const tag = operation.tags?.[0] || "General";
        if (!groups[tag]) groups[tag] = [];
        groups[tag].push({ path, method, operation });
      });
    });

    return groups;
  }, [jsonData, search]);

  const totalCount = Object.values(groupedPaths).reduce(
    (acc, e) => acc + e.length,
    0
  );

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 shrink-0 bg-zinc-900/95 md:bg-zinc-900/60 border-r border-zinc-800 text-white flex flex-col transform transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-300">
              Endpoints
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={onReload}
                title="Recargar API"
                className="w-7 h-7 grid place-items-center rounded-md text-indigo-400 hover:text-indigo-300 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <IoReloadCircle size={20} />
              </button>
              <button
                onClick={onClose}
                aria-label="Cerrar menú"
                className="md:hidden w-7 h-7 grid place-items-center rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <IoClose size={18} />
              </button>
            </div>
          </div>

          <div className="relative">
            <IoSearch
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500"
              size={14}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar endpoint..."
              className="w-full bg-zinc-800/60 border border-zinc-700 rounded-md pl-8 pr-2 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3">
          {totalCount === 0 ? (
            <p className="text-sm text-zinc-500 text-center mt-6">
              Sin resultados
            </p>
          ) : (
            Object.entries(groupedPaths).map(([tag, endpoints]) => (
              <TagGroup
                key={tag}
                tag={tag}
                endpoints={endpoints}
                selectedPath={selectedPath}
                selectedMethod={selectedMethod}
                onSelect={onSelect}
              />
            ))
          )}
        </div>
      </aside>
    </>
  );
}
