"use client";

import { useEffect, useMemo, useState } from "react";
import type { TestimonialData } from "@/types/cms";

function chunkPairs(items: TestimonialData[]) {
  const pairs: TestimonialData[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2));
  }
  return pairs;
}

export function TestimonialCarousel({ items }: { items: TestimonialData[] }) {
  const pairs = useMemo(() => chunkPairs(items), [items]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (pairs.length <= 1) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % pairs.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [pairs.length]);

  return (
    <div className="testimonial-carousel">
      <div className="testimonial-carousel-viewport">
        <div className="testimonial-carousel-track" style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}>
          {pairs.map((pair, slideIndex) => (
            <div className="testimonial-carousel-slide" key={slideIndex} aria-hidden={slideIndex !== index}>
              {pair.map((item) => (
                <blockquote key={item._id ?? `${item.clientName}-${item.quote.slice(0, 24)}`}>
                  {item.serviceLabel && <span className="testimonial-label">{item.serviceLabel}</span>}
                  <p>“{item.quote}”</p>
                  <footer>
                    {item.clientName}
                    {item.company && ` — ${item.company}`}
                  </footer>
                </blockquote>
              ))}
            </div>
          ))}
        </div>
      </div>
      {pairs.length > 1 && (
        <div className="testimonial-carousel-dots" role="tablist" aria-label="Testimonial slides">
          {pairs.map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              role="tab"
              aria-selected={dotIndex === index}
              aria-label={`Show testimonials ${dotIndex * 2 + 1}${pairs[dotIndex][1] ? ` and ${dotIndex * 2 + 2}` : ""}`}
              className={dotIndex === index ? "active" : undefined}
              onClick={() => setIndex(dotIndex)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
