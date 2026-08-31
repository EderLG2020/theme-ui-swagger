// src/utils/apiColors.ts
// Estilos compartidos para métodos HTTP y status codes, usados en
// EndpointButton, EndpointDetails y Responses para mantener una
// paleta consistente en toda la app.

export interface AccentStyle {
  badge: string; // pastilla sólida (fondo + texto)
  text: string; // solo color de texto, para usos sutiles
  border: string; // color de borde a juego con `text`
}

const METHOD_STYLES: Record<string, AccentStyle> = {
  get: {
    badge: "bg-emerald-500 text-emerald-950",
    text: "text-emerald-400",
    border: "border-emerald-500",
  },
  post: {
    badge: "bg-sky-500 text-sky-950",
    text: "text-sky-400",
    border: "border-sky-500",
  },
  put: {
    badge: "bg-amber-500 text-amber-950",
    text: "text-amber-400",
    border: "border-amber-500",
  },
  delete: {
    badge: "bg-rose-500 text-rose-950",
    text: "text-rose-400",
    border: "border-rose-500",
  },
  patch: {
    badge: "bg-violet-500 text-violet-950",
    text: "text-violet-400",
    border: "border-violet-500",
  },
  options: {
    badge: "bg-slate-500 text-slate-950",
    text: "text-slate-400",
    border: "border-slate-500",
  },
  head: {
    badge: "bg-slate-400 text-slate-950",
    text: "text-slate-300",
    border: "border-slate-400",
  },
};

const DEFAULT_METHOD_STYLE: AccentStyle = {
  badge: "bg-zinc-500 text-zinc-950",
  text: "text-zinc-400",
  border: "border-zinc-500",
};

export function getMethodStyle(method: string): AccentStyle {
  return METHOD_STYLES[method.toLowerCase()] || DEFAULT_METHOD_STYLE;
}

const STATUS_STYLES: Record<string, AccentStyle> = {
  "1": {
    badge: "bg-slate-500 text-slate-950",
    text: "text-slate-400",
    border: "border-slate-400",
  },
  "2": {
    badge: "bg-emerald-500 text-emerald-950",
    text: "text-emerald-400",
    border: "border-emerald-400",
  },
  "3": {
    badge: "bg-sky-500 text-sky-950",
    text: "text-sky-400",
    border: "border-sky-400",
  },
  "4": {
    badge: "bg-amber-500 text-amber-950",
    text: "text-amber-400",
    border: "border-amber-400",
  },
  "5": {
    badge: "bg-rose-500 text-rose-950",
    text: "text-rose-400",
    border: "border-rose-400",
  },
};

const DEFAULT_STATUS_STYLE: AccentStyle = {
  badge: "bg-zinc-500 text-zinc-950",
  text: "text-zinc-400",
  border: "border-zinc-400",
};

export function getStatusStyle(status: string): AccentStyle {
  return STATUS_STYLES[status[0]] || DEFAULT_STATUS_STYLE;
}
