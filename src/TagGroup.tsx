// TagGroup.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronForward } from "react-icons/io5";
import type { OpenApiOperation } from "./interfaces/swagger.interface";
import EndpointButton from "./EndpointButton";

interface TagGroupProps {
  tag: string;
  endpoints: { path: string; method: string; operation: OpenApiOperation }[];
  selectedPath: string | null;
  selectedMethod: string | null;
  onSelect: (path: string, method: string) => void;
}

export default function TagGroup({
  tag,
  endpoints,
  selectedPath,
  selectedMethod,
  onSelect,
}: TagGroupProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mb-2">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-zinc-300 hover:bg-zinc-800/60 hover:text-white transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wide">
          <motion.span
            animate={{ rotate: collapsed ? 0 : 90 }}
            transition={{ duration: 0.15 }}
            className="text-zinc-500 flex"
          >
            <IoChevronForward size={12} />
          </motion.span>
          {tag}
        </span>
        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800 rounded-full px-1.5 py-0.5">
          {endpoints.length}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-1 pl-1"
          >
            {endpoints.map(({ path, method }) => (
              <EndpointButton
                key={`${method}-${path}`}
                method={method}
                path={path}
                selected={selectedPath === path && selectedMethod === method}
                onClick={() => onSelect(path, method)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
