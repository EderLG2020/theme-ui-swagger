import { useState } from "react";
import type {
  OpenApiOperation,
  OpenApiParameter,
} from "./interfaces/swagger.interface";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { IoChevronDown } from "react-icons/io5";
import { getMethodStyle, getStatusStyle } from "./utils/apiColors";

interface EndpointDetailsProps {
  operation: OpenApiOperation | null;
  path?: string;
  method?: string;
}

const paramStyles: Record<string, string> = {
  query: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  path: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  header: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  cookie: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

const codeStyle = {
  borderRadius: "0.5rem",
  padding: "0.75rem",
  fontSize: "0.8rem",
  background: "rgb(24 24 27)",
  border: "1px solid rgb(39 39 42)",
};

export default function EndpointDetails({
  operation,
  path,
  method,
}: EndpointDetailsProps) {
  const statuses = operation ? Object.keys(operation.responses) : [];
  const [activeStatus, setActiveStatus] = useState<string>(statuses[0] || "");
  const [showParams, setShowParams] = useState(true);

  if (!operation)
    return (
      <div className="w-full md:w-1/3 md:shrink-0 border-b md:border-b-0 md:border-r border-zinc-800 grid place-items-center min-h-[160px] md:min-h-0 py-10 md:py-0">
        <p className="text-zinc-500 text-sm text-center px-6">
          Selecciona un endpoint en el panel izquierdo
        </p>
      </div>
    );

  const renderSchema = (schema: any) => {
    if (!schema?.properties) return null;
    return (
      <ul className="text-sm space-y-1.5">
        {Object.entries(schema.properties).map(([key, prop]: any) => (
          <li key={key} className="flex flex-wrap items-baseline gap-1">
            <span className="font-mono text-zinc-200">{key}</span>
            {prop.description && (
              <span className="text-zinc-500"> {prop.description}</span>
            )}
            {prop.example !== undefined && (
              <span className="text-emerald-400 font-mono text-xs">
                ej: {JSON.stringify(prop.example)}
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const methodStyle = method ? getMethodStyle(method) : null;

  return (
    <div className="w-full md:w-1/3 md:shrink-0 overflow-visible md:overflow-y-auto border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950">
      <div className="sticky top-0 bg-zinc-950/90 backdrop-blur-sm z-10 px-6 pt-5 pb-4 border-b border-zinc-800">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {method && methodStyle && (
            <span
              className={`font-mono text-xs font-bold uppercase px-2 py-0.5 rounded ${methodStyle.badge}`}
            >
              {method}
            </span>
          )}
          {path && (
            <span className="text-sm text-zinc-400 font-mono break-all">
              {path}
            </span>
          )}
          {operation.deprecated && (
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
              Deprecated
            </span>
          )}
        </div>
        <h2 className="text-lg font-bold text-white leading-snug">
          {operation.summary}
        </h2>
      </div>

      <div className="px-6 py-5">
        {operation.description && (
          <div className="mb-6 text-sm text-zinc-400 prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{operation.description}</ReactMarkdown>
          </div>
        )}

        {operation.parameters && operation.parameters.length > 0 && (
          <div className="mb-6">
            <button
              className="w-full flex items-center justify-between mb-2 cursor-pointer group"
              onClick={() => setShowParams(!showParams)}
            >
              <h3 className="font-semibold text-sm uppercase tracking-wide text-zinc-300">
                Parameters
              </h3>
              <motion.span
                animate={{ rotate: showParams ? 0 : -90 }}
                transition={{ duration: 0.15 }}
                className="text-zinc-500 group-hover:text-zinc-300 flex"
              >
                <IoChevronDown size={14} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {showParams && (
                <motion.ul
                  className="space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {operation.parameters.map(
                    (param: OpenApiParameter, idx: number) => (
                      <li
                        key={idx}
                        className="flex flex-col gap-1 bg-zinc-900/60 border border-zinc-800 rounded-lg p-3"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded border ${
                              paramStyles[param.in] ||
                              "bg-zinc-700/30 text-zinc-300 border-zinc-600"
                            }`}
                          >
                            {param.in}
                          </span>
                          <span className="font-mono text-sm text-zinc-100">
                            {param.name}
                          </span>
                          {param.required && (
                            <span className="text-[10px] font-semibold uppercase text-rose-400">
                              required
                            </span>
                          )}
                        </div>
                        {param.description && (
                          <div className="text-xs text-zinc-500 prose prose-invert prose-xs max-w-none">
                            <ReactMarkdown>{param.description}</ReactMarkdown>
                          </div>
                        )}
                      </li>
                    )
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}

        {operation.requestBody && (
          <div className="mb-6">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-zinc-300 mb-2">
              Request Body
            </h3>
            {Object.entries(operation.requestBody.content).map(
              ([mime, media]) => (
                <div key={mime} className="mb-3">
                  <p className="text-xs text-zinc-500 font-mono mb-1.5">
                    {mime}
                  </p>
                  {media.schema && renderSchema(media.schema)}
                  {media.example && (
                    <SyntaxHighlighter
                      language="json"
                      style={vscDarkPlus}
                      customStyle={codeStyle}
                    >
                      {JSON.stringify(media.example, null, 2)}
                    </SyntaxHighlighter>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {statuses.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-zinc-300 mb-2">
              Responses
            </h3>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold transition-all cursor-pointer ${
                    activeStatus === status
                      ? getStatusStyle(status).badge
                      : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {activeStatus && operation.responses[activeStatus] && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStatus}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-lg"
                >
                  {operation.responses[activeStatus].description && (
                    <div className="mb-2 text-sm text-zinc-400 prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>
                        {operation.responses[activeStatus].description}
                      </ReactMarkdown>
                    </div>
                  )}
                  {operation.responses[activeStatus].content &&
                    Object.entries(
                      operation.responses[activeStatus].content
                    ).map(([mime, media]) => (
                      <div key={mime} className="mb-2">
                        <p className="text-xs text-zinc-500 font-mono mb-1.5">
                          {mime}
                        </p>
                        {media.schema && renderSchema(media.schema)}
                        {media.example && (
                          <SyntaxHighlighter
                            language="json"
                            style={vscDarkPlus}
                            customStyle={codeStyle}
                          >
                            {JSON.stringify(media.example, null, 2)}
                          </SyntaxHighlighter>
                        )}
                      </div>
                    ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
