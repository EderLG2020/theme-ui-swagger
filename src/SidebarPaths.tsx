// SidebarPaths.tsx
import type {
  OpenApiDocument,
  OpenApiOperation,
} from "../src/interfaces/swagger.interface";
import TagGroup from "./TagGroup";

interface SidebarProps {
  jsonData: OpenApiDocument;
  selectedPath: string | null;
  selectedMethod: string | null;
  onSelect: (path: string, method: string) => void;
}

export default function SidebarPaths({
  jsonData,
  selectedPath,
  selectedMethod,
  onSelect,
}: SidebarProps) {
  // Agrupar paths por tags
  const groupedPaths: Record<
    string,
    { path: string; method: string; operation: OpenApiOperation }[]
  > = {};

  Object.entries(jsonData.paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, operation]) => {
      const tag = operation.tags?.[0] || "General";
      if (!groupedPaths[tag]) groupedPaths[tag] = [];
      groupedPaths[tag].push({ path, method, operation });
    });
  });

  return (
    <div className="w-64 bg-gray-900 text-white p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">API Paths</h2>
      {Object.entries(groupedPaths).map(([tag, endpoints]) => (
        <TagGroup
          key={tag}
          tag={tag}
          endpoints={endpoints}
          selectedPath={selectedPath}
          selectedMethod={selectedMethod}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
