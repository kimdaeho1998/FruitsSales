import { NextResponse, type NextRequest } from "next/server";
export function middleware(_request: NextRequest) { /* Auth hook point: enforce an admin session when authentication is implemented. */ return NextResponse.next(); }
export const config = { matcher: ["/admin/:path*"] };
