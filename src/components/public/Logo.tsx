import Image from "next/image";
import Link from "next/link";
import type { MediaItem } from "@/types/cms";

export function Logo({ compact = false, image }: { compact?: boolean; image?: MediaItem }) {
  return (
    <Link href="/" className="logo" aria-label="Canam Facility Services home">
      {image?.url ? (
        <span className="logo-image"><Image src={image.url} alt={image.alt || "Canam Facility Services"} fill sizes="220px" /></span>
      ) : (
        <span className="logo-mark" aria-hidden="true"><span>C</span><i /></span>
      )}
      {!compact && (
        <span className="logo-type">
          <strong>CANAM</strong>
          <small>FACILITY SERVICES</small>
        </span>
      )}
    </Link>
  );
}
