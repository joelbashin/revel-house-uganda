import React from 'react';

export const MapDecoration: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-64 h-64 text-[#69B53F]/10',
  color,
}) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    {/* Abstract geometric silhouette inspired by Uganda topography and Lake Victoria shoreline */}
    <path
      d="M50 35 C75 25, 120 30, 145 45 C170 60, 165 95, 155 125 C145 155, 115 175, 80 170 C50 165, 35 135, 30 105 C25 75, 30 45, 50 35 Z"
      fill={color || 'currentColor'}
    />
    <path
      d="M100 80 Q120 95 130 120 Q110 135 90 125 Q85 100 100 80 Z"
      fill="#F7F8F6"
      opacity="0.6"
    />
    <circle cx="102" cy="78" r="3" fill="#F5A623" opacity="0.8" />
  </svg>
);

export const OrganicBlob: React.FC<{
  className?: string;
  color?: 'cream' | 'green' | 'orange' | 'teal' | 'coral';
}> = ({ className = 'w-72 h-72', color = 'cream' }) => {
  const fill = {
    cream: '#EDEBE2',
    green: '#69B53F',
    orange: '#F5A623',
    teal: '#36A8A0',
    coral: '#E85B3F',
  }[color];

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none transition-transform duration-700 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M312.5 124.5C345.5 166.5 352.5 227.5 329.5 273.5C306.5 319.5 253.5 350.5 197.5 353.5C141.5 356.5 82.5 331.5 54.5 285.5C26.5 239.5 29.5 172.5 61.5 126.5C93.5 80.5 154.5 55.5 212.5 57.5C270.5 59.5 279.5 82.5 312.5 124.5Z"
        fill={fill}
      />
    </svg>
  );
};

export const DotPattern: React.FC<{ className?: string; rows?: number; cols?: number }> = ({
  className = '',
  rows = 4,
  cols = 8,
}) => (
  <div className={`grid gap-2 pointer-events-none select-none ${className}`} aria-hidden="true">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-2">
        {Array.from({ length: cols }).map((_, c) => (
          <div
            key={c}
            className="w-1.5 h-1.5 rounded-full bg-[#111111]/15"
          />
        ))}
      </div>
    ))}
  </div>
);

export const DecorativeDots: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center space-x-2 pointer-events-none select-none ${className}`} aria-hidden="true">
    <span className="w-2.5 h-2.5 rounded-full bg-[#69B53F]" />
    <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623]" />
    <span className="w-2.5 h-2.5 rounded-full bg-[#36A8A0]" />
  </div>
);
