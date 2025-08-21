import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import type { OpenApiOperation } from "./interfaces/swagger.interface";

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
      <p className="text-gray-400 italic">Las respuestas se mostrarán aquí</p>
    );

  const statuses = Object.keys(operation.responses);

  // Colores por tipo de status
  const statusColors: Record<string, string> = {
    "1": "bg-gray-500 text-white",
    "2": "bg-green-600 text-white",
    "3": "bg-blue-600 text-white",
    "4": "bg-yellow-500 text-black",
    "5": "bg-red-600 text-white",
  };

  return (
    <div className="flex-1 p-6 overflow-auto text-gray-100">
      <h3 className="font-semibold mb-4 text-lg text-white">Responses</h3>

      <div className="border border-gray-700 rounded-lg shadow-md overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-700 bg-gray-800">
          {statuses.map((status) => {
            const isActive = activeStatus === status;
            const colorClass =
              statusColors[status[0]] || "bg-gray-600 text-white";

            return (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`px-4 py-2 font-mono font-bold text-sm border-r last:border-r-0 transition-colors duration-200
                  ${
                    isActive
                      ? ` ${colorClass}`
                      : "text-gray-400 hover:text-gray-200"
                  }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* Tab content animado */}
        <div className="bg-gray-900 rounded-b overflow-auto mt-1 p-2">
          <AnimatePresence mode="wait">
            {activeStatus && (
              <motion.div
                key={activeStatus}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <SyntaxHighlighter
                  language="json"
                  style={vscDarkPlus}
                  wrapLines
                  showLineNumbers
                  customStyle={{
                    borderRadius: "0.5rem",
                    fontSize: "0.85rem",
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
