"use client";

import { useEffect, useState } from "react";

type Props = {
  count: number;
  intervalMs?: number;
  children: (index: number) => React.ReactNode;
  className?: string;
};

export function Carousel({
  count,
  intervalMs = 7000,
  children,
  className = "",
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (count <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [count, intervalMs]);

  return (
    <div className={`relative ${className}`}>
      <div key={index} className="carousel-slide">
        {children(index)}
      </div>
      {count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === index
                  ? "w-7 bg-[var(--primary)]"
                  : "w-2.5 bg-[var(--border-strong)] hover:bg-[var(--fg-subtle)]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
