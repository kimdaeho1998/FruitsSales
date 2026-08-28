import type { SelectHTMLAttributes } from "react";
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) { return <select className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2" {...props} />; }
