import { useState } from "react";
import type {
  OpenApiOperation,
  OpenApiParameter,
} from "./interfaces/swagger.interface";
import { motion, AnimatePresence } from "framer-motion";

interface EndpointDetailsProps {
  operation: OpenApiOperation | null;
  path?: string;
  method?: string;
}

export default function EndpointDetails({
  operation,
  path,
  method,
}: EndpointDetailsProps) {
  if (!operation)
    return (
      <p className="text-gray-400 p-6">Selecciona un endpoint en el sidebar</p>
    );

  const paramColors: Record<string, string> = {
    query: "bg-blue-600 text-white",
    path: "bg-green-600 text-white",
    header: "bg-purple-600 text-white",
    cookie: "bg-yellow-600 text-black",
  };

  const statusColors: Record<string, string> = {
    "2": "bg-green-600 text-white",
    "3": "bg-blue-600 text-white",
    "4": "bg-red-600 text-white",
    "5": "bg-red-800 text-white",
  };

  const statuses = Object.keys(operation.responses);
  const [activeStatus, setActiveStatus] = useState<string>(statuses[0]);

  // Función para renderizar un schema en lista
  const renderSchema = (schema: any) => {
    if (!schema?.properties) return null;
    return (
      <ul className="list-disc list-inside text-gray-200 text-sm space-y-1">
        {Object.entries(schema.properties).map(([key, prop]: any) => (
          <li key={key}>
            <span className="font-mono">{key}</span>:
            {prop.description && (
              <span className="text-gray-400"> {prop.description}</span>
            )}
            {prop.example && (
              <span className="text-green-400 font-mono">
                {" "}
                (ej: {JSON.stringify(prop.example)})
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-1/3 p-6 overflow-auto border-r border-gray-700 bg-gray-900 text-gray-100 rounded-l shadow-lg">
      {/* Path y método */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {method && (
          <span
            className={`font-mono text-xs uppercase px-2 py-0.5 rounded ${
              paramColors[method.toLowerCase()] || "bg-gray-500 text-white"
            }`}
          >
            {method.toUpperCase()}
          </span>
        )}
        {path && (
          <span className="text-sm text-blue-400 font-mono break-all">
            {path}
          </span>
        )}
      </div>

      {/* Summary */}
      <h2 className="text-2xl font-bold mb-2 text-white">
        {operation.summary}
      </h2>
      {operation.description && (
        <p className="mb-4 text-gray-300">{operation.description}</p>
      )}

      {/* Parameters */}
      {operation.parameters && operation.parameters.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-lg">Parameters</h3>
          <AnimatePresence>
            <motion.ul
              className="list-disc list-inside space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {operation.parameters.map(
                (param: OpenApiParameter, idx: number) => (
                  <motion.li
                    key={idx}
                    className="flex flex-wrap items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                  >
                    <span
                      className={`font-mono text-xs uppercase px-2 py-0.5 rounded ${
                        paramColors[param.in] || "bg-gray-500 text-white"
                      }`}
                    >
                      {param.in}
                    </span>
                    <span className="font-mono">{param.name}</span>
                    {param.required && (
                      <span className="text-red-400 font-semibold">
                        *required*
                      </span>
                    )}
                    {param.description && (
                      <span className="text-gray-300">
                        {" "}
                        - {param.description}
                      </span>
                    )}
                  </motion.li>
                )
              )}
            </motion.ul>
          </AnimatePresence>
        </div>
      )}

      {/* Request Body */}
      {operation.requestBody && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-lg">Request Body</h3>
          {Object.entries(operation.requestBody.content).map(
            ([mime, media]) => (
              <div key={mime} className="mb-2">
                <p className="text-sm text-gray-400 mb-1">{mime}</p>
                {media.schema && renderSchema(media.schema)}
                {media.example && (
                  <pre className="bg-gray-800 p-2 rounded text-green-400 font-mono overflow-auto text-sm">
                    {JSON.stringify(media.example, null, 2)}
                  </pre>
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* Responses */}
      {statuses.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2 text-lg">Responses</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`px-3 py-1 rounded font-mono text-sm ${
                  activeStatus === status
                    ? "ring-2 ring-offset-2 ring-white"
                    : "opacity-70 hover:opacity-100"
                } ${statusColors[status[0]] || "bg-gray-700 text-white"}`}
              >
                {status}
              </button>
            ))}
          </div>

          {activeStatus && operation.responses[activeStatus] && (
            <AnimatePresence>
              <motion.div
                key={activeStatus}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 p-4 rounded shadow-inner overflow-auto"
              >
                <p className="mb-2 text-gray-300 font-semibold">
                  {operation.responses[activeStatus].description}
                </p>
                {operation.responses[activeStatus].content &&
                  Object.entries(operation.responses[activeStatus].content).map(
                    ([mime, media]) => (
                      <div key={mime} className="mb-2">
                        <p className="text-sm text-gray-400 mb-1">{mime}</p>
                        {media.schema && renderSchema(media.schema)}
                        {media.example && (
                          <pre className="bg-gray-800 p-2 rounded text-green-400 font-mono overflow-auto text-sm">
                            {JSON.stringify(media.example, null, 2)}
                          </pre>
                        )}
                      </div>
                    )
                  )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
    </div>
  );
}
