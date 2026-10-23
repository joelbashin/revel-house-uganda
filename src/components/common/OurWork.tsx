import React from 'react';
import { VideoCarousel } from './VideoCarousel';

const DISPLAY_FONT =
  "'Inter', 'Helvetica Neue', 'Segoe UI', system-ui, -apple-system, 'Poppins', sans-serif";

export const OurWork: React.FC = () => {
  return (
    <section
      id="our-work-section"
      className="relative bg-[var(--c-bg)] py-16 md:py-24 overflow-hidden"
      aria-label="Our Work"
    >
      {/* Section heading */}
      <h2
        className="text-center text-[var(--c-ink)] px-5"
        style={{
          fontFamily: DISPLAY_FONT,
          fontSize: 'clamp(30px, 5vw, 40px)',
          fontWeight: 650,
          letterSpacing: '-0.02em',
        }}
      >
        Our Work
      </h2>

      {/* Overlapping card gallery */}
      <div className="mt-10 md:mt-14">
        <VideoCarousel />
      </div>
    </section>
  );
};