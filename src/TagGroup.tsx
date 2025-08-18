// TagGroup.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { OpenApiOperation } from "../src/interfaces/swagger.interface";
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
    <div className="mb-4">
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="flex justify-between items-center px-2 py-1 rounded bg-gray-800 text-gray-200 cursor-pointer hover:bg-gray-700 transition-colors"
      >
        <span className="font-semibold">{tag}</span>
        <span className="text-sm">{collapsed ? "+" : "-"}</span>
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-2"
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
