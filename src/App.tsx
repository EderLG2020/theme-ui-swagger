import { useState } from "react";
import axios from "axios";
import { IoSwapHorizontal, IoMenu } from "react-icons/io5";
import UrlLoader from "./UrlLoader";
import SidebarPaths from "./SidebarPaths";
import EndpointDetails from "./EndpointDetails";
import Responses from "./Responses";
import type {
  OpenApiDocument,
  OpenApiOperation,
} from "./interfaces/swagger.interface";

export default function App() {
  const [jsonData, setJsonData] = useState<OpenApiDocument | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUrl, setLastUrl] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLoadJson = async (url: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(url);
      setJsonData(res.data);
      setLastUrl(url);
    } catch (err: any) {
      setError(err.message || "Error al cargar el JSON");
    } finally {
      setLoading(false);
    }
  };

  const handleReload = async () => {
    if (lastUrl) {
      await handleLoadJson(lastUrl);
    }
  };

  const handleChangeSource = () => {
    setJsonData(null);
    setSelectedPath(null);
    setSelectedMethod(null);
    setError("");
  };

  const currentOperation: OpenApiOperation | null =
    jsonData && selectedPath && selectedMethod
      ? jsonData.paths[selectedPath][selectedMethod]
      : null;

  if (!jsonData) {
    return (
      <UrlLoader onLoad={handleLoadJson} loading={loading} error={error} />
    );
  }

  return (
    <div className="flex flex-col w-screen h-screen bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between gap-4 px-4 md:px-6 py-3 border-b border-zinc-800 bg-zinc-900/70 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
            className="md:hidden w-8 h-8 grid place-items-center rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
          >
            <IoMenu size={20} />
          </button>
          <div className="flex items-baseline gap-3 min-w-0">
            <h1 className="text-base font-bold text-white truncate">
              {jsonData.info?.title || "API Docs"}
            </h1>
            {jsonData.info?.version && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shrink-0">
                v{jsonData.info.version}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleChangeSource}
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
        >
          <IoSwapHorizontal size={14} />
          <span className="hidden sm:inline">Cambiar API</span>
        </button>
      </header>

      <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
        <SidebarPaths
          jsonData={jsonData}
          selectedPath={selectedPath}
          selectedMethod={selectedMethod}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelect={(path, method) => {
            setSelectedPath(path);
            setSelectedMethod(method);
            setSidebarOpen(false);
          }}
          onReload={handleReload}
        />

        <EndpointDetails
          operation={currentOperation}
          path={selectedPath || undefined}
          method={selectedMethod || undefined}
        />

        <Responses operation={currentOperation} />
      </div>
    </div>
  );
}
