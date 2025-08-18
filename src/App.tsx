import { useState } from "react";
import axios from "axios";
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

  const handleLoadJson = async (url: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(url);
      setJsonData(res.data);
    } catch (err: any) {
      setError(err.message || "Error al cargar el JSON");
    } finally {
      setLoading(false);
    }
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
    <div className="flex w-screen h-screen bg-gray-950 text-white">
      <SidebarPaths
        jsonData={jsonData}
        selectedPath={selectedPath}
        selectedMethod={selectedMethod}
        onSelect={(path, method) => {
          setSelectedPath(path);
          setSelectedMethod(method);
        }}
      />

      <EndpointDetails
        operation={currentOperation}
        path={selectedPath || undefined}
        method={selectedMethod || undefined}
      />

      <Responses operation={currentOperation} />
    </div>
  );
}
