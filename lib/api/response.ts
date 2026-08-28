import { NextResponse } from "next/server";
import type { ApiErrorResponse } from "@/types/api";
export function notImplemented(message = "This endpoint is not implemented in the project scaffold."): NextResponse<ApiErrorResponse> { return NextResponse.json({ error: { code: "NOT_IMPLEMENTED", message } }, { status: 501 }); }
