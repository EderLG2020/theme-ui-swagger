import { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";

interface UrlLoaderProps {
  onLoad: (url: string) => void;
  loading: boolean;
  error: string;
}

export default function UrlLoader({ onLoad, loading, error }: UrlLoaderProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = () => {
    if (url && !loading) onLoad(url);
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-zinc-950 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_55%)] p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 grid place-items-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 mb-4">
            <IoCloudUploadOutline className="text-indigo-400" size={24} />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">
            Explorador de API
          </h1>
          <p className="text-sm text-zinc-400">
            Ingresa la URL de un documento OpenAPI / Swagger JSON
          </p>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 shadow-xl">
          <input
            type="text"
            placeholder="https://api.ejemplo.com/swagger.json"
            className="w-full bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 mb-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button
            className="w-full px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            onClick={handleSubmit}
            disabled={loading || !url}
          >
            {loading ? "Cargando..." : "Cargar documentación"}
          </button>

          {error && (
            <p className="mt-3 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
