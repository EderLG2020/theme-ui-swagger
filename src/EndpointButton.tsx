// EndpointButton.tsx
import { getMethodStyle } from "./utils/apiColors";

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
  const style = getMethodStyle(method);

  return (
    <button
      onClick={onClick}
      className={`group w-full text-left mb-1 pl-2 pr-2 py-2 flex items-center gap-2 rounded-md border-l-2 transition-colors duration-150 cursor-pointer ${
        selected
          ? `bg-zinc-800/80 ${style.border}`
          : "border-transparent hover:bg-zinc-800/40"
      }`}
    >
      <span
        className={`font-mono text-[10px] font-bold uppercase w-14 shrink-0 text-center px-1.5 py-0.5 rounded ${style.badge}`}
      >
        {method}
      </span>
      <span
        className={`text-sm truncate ${
          selected
            ? "text-zinc-100"
            : "text-zinc-400 group-hover:text-zinc-200"
        }`}
        title={path}
      >
        {path}
      </span>
    </button>
  );
}
