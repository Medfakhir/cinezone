import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export function middleware(req) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/admin")) {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            if (!decoded.isAdmin) {
                return NextResponse.redirect(new URL("/login", req.url));
            }
        } catch (err) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
