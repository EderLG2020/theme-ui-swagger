// EndpointButton.tsx
interface EndpointButtonProps {
  method: string;
  path: string;
  selected: boolean;
  onClick: () => void;
}

export default function EndpointButton({
  method,
  path,
  selected,
  onClick,
}: EndpointButtonProps) {
  const methodColors: Record<string, string> = {
    get: "bg-green-600 text-white",
    post: "bg-blue-600 text-white",
    put: "bg-yellow-600 text-white",
    delete: "bg-red-600 text-white",
    patch: "bg-purple-600 text-white",
    options: "bg-gray-600 text-white",
    head: "bg-gray-500 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left mb-2 p-2 flex items-center gap-2 rounded hover:bg-gray-700 transition-colors duration-200 ${
        selected ? "bg-gray-700" : ""
      }`}
    >
      <span
        className={`font-mono text-xs uppercase px-2 py-0.5 rounded ${
          methodColors[method.toLowerCase()] || "bg-gray-500 text-white"
        }`}
      >
        {method}
      </span>
      <span className="text-sm break-all">{path}</span>
    </button>
  );
}
