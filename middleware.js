// Public static pages are served by Vercel's static layer. All state-changing and
// protected requests perform the authoritative blocked-IP check in their function.
// This middleware keeps the edge boundary explicit without requiring a Node-only
// Postgres driver in the Edge runtime.
export const config = { matcher: ['/api/:path*', '/admin/:path*'] };
export default function middleware(request) {
  return undefined;
}
