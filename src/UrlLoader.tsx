import { useState } from "react";

interface UrlLoaderProps {
  onLoad: (url: string) => void;
  loading: boolean;
  error: string;
}

export default function UrlLoader({ onLoad, loading, error }: UrlLoaderProps) {
  const [url, setUrl] = useState("");

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Carga un JSON desde URL</h1>
      <input
        type="text"
        placeholder="Ingresa la URL del JSON"
        className="w-full max-w-lg p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => onLoad(url)}
        disabled={loading || !url}
      >
        {loading ? "Cargando..." : "Cargar JSON"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
