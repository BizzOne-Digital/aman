import { NextResponse } from "next/server";

function hash(value: string) {
  return [...value].reduce((total, char) => (total * 31 + char.charCodeAt(0)) >>> 0, 0);
}

export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const name = (await params).name.replace(/[^a-z0-9-]/gi, "").slice(0, 50);
  const seed = hash(name);
  const x = 140 + (seed % 420);
  const y = 100 + ((seed >> 4) % 250);
  const hue = 205 + (seed % 22);
  const label = name.replace(/-/g, " ").toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
    <defs>
      <linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop stop-color="hsl(${hue} 98% 42%)"/><stop offset="1" stop-color="#031329"/></linearGradient>
      <radialGradient id="g"><stop stop-color="#64c8ff" stop-opacity=".85"/><stop offset="1" stop-color="#075dff" stop-opacity="0"/></radialGradient>
      <filter id="blur"><feGaussianBlur stdDeviation="42"/></filter>
      <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="#fff" stroke-opacity=".08"/></pattern>
    </defs>
    <rect width="1600" height="1000" fill="url(#b)"/><rect width="1600" height="1000" fill="url(#grid)"/>
    <circle cx="${x}" cy="${y}" r="360" fill="url(#g)" filter="url(#blur)"/>
    <path d="M-50 760C290 560 540 910 860 700s520-100 810-280v460H-50z" fill="#fff" fill-opacity=".12"/>
    <path d="M-50 830C270 650 580 950 920 760s510-120 760-300" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="12"/>
    <g transform="translate(1090 160)" fill="none" stroke="#fff" stroke-opacity=".7"><circle r="150" stroke-width="2"/><circle r="118" stroke-width="1"/><path d="M-180 0h360M0-180v360" stroke-width="1"/></g>
    <text x="90" y="105" fill="#fff" fill-opacity=".7" font-family="Arial" font-size="22" letter-spacing="7">CANAM FACILITY SERVICES</text>
    <text x="90" y="910" fill="#fff" font-family="Arial" font-weight="700" font-size="44" letter-spacing="3">${label}</text>
  </svg>`;
  return new NextResponse(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
