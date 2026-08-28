import type { ButtonHTMLAttributes } from "react";
export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <button className={`rounded-md bg-[var(--primary)] px-4 py-2 font-medium text-[var(--primary-foreground)] ${className}`} {...props} />; }
