"use client";
import { useState } from "react";

export function SafeImage({
  src,
  alt,
  className = "",
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-brand to-deep text-skyvivid ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="font-display text-2xl font-semibold tracking-tight opacity-90">
          EasyEVNepal
        </span>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`img-grade ${className}`}
      draggable={false}
    />
  );
}
