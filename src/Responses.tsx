import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import type { OpenApiOperation } from "./interfaces/swagger.interface";
import { getStatusStyle } from "./utils/apiColors";

interface ResponsesProps {
  operation: OpenApiOperation | null;
}

export default function Responses({ operation }: ResponsesProps) {
  const [activeStatus, setActiveStatus] = useState<string>("");

  useEffect(() => {
    if (operation) setActiveStatus(Object.keys(operation.responses)[0] || "");
  }, [operation]);

  if (!operation)
    return (
      <div className="flex-1 grid place-items-center min-h-[160px] md:min-h-0 py-10 md:py-0">
        <p className="text-zinc-500 text-sm text-center px-6">
          Las respuestas se mostrarán aquí
        </p>
      </div>
    );

  const statuses = Object.keys(operation.responses);

  return (
    <div className="flex-1 overflow-visible md:overflow-y-auto px-6 py-5">
      <h3 className="font-semibold text-sm uppercase tracking-wide text-zinc-300 mb-3">
        Response Samples
      </h3>

      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40">
        <div className="flex border-b border-zinc-800 bg-zinc-900/60 overflow-x-auto">
          {statuses.map((status) => {
            const isActive = activeStatus === status;
            const style = getStatusStyle(status);

            return (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`px-4 py-2.5 font-mono font-bold text-sm border-b-2 transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? `${style.text} ${style.border}`
                    : "text-zinc-500 border-transparent hover:text-zinc-300"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        <div className="overflow-auto p-1">
          <AnimatePresence mode="wait">
            {activeStatus && (
              <motion.div
                key={activeStatus}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <SyntaxHighlighter
                  language="json"
                  style={vscDarkPlus}
                  wrapLines
                  showLineNumbers
                  customStyle={{
                    borderRadius: "0.5rem",
                    fontSize: "0.85rem",
                    background: "transparent",
                    margin: 0,
                  }}
                >
                  {JSON.stringify(operation.responses[activeStatus], null, 2)}
                </SyntaxHighlighter>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
