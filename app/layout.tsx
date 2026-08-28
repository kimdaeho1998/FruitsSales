import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "FruitsSales", description: "제철 과일을 소개하는 모바일 우선 커머스" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body>{children}</body></html>; }
