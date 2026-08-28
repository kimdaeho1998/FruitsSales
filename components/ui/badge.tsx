import type { HTMLAttributes } from "react";
export function Badge(props: HTMLAttributes<HTMLSpanElement>) { return <span className="rounded-full bg-[var(--muted)] px-2 py-1 text-xs" {...props} />; }
