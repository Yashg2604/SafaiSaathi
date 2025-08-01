import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    // Do nothing (no authentication check)
    return NextResponse.next();
}

export const config = {
    // Optionally, remove or keep matcher
    matcher: ["/:path*"],
};
