'use client';

import React from 'react';

interface BrandLogoProps {
  width?: number | string;
  height?: number | string;
  variant?: 'dark' | 'light'; // 'dark' = for dark backgrounds (white+emerald+gold), 'light' = for light backgrounds (chocolate+forest+gold)
  showAdminBadge?: boolean;
}

export default function BrandLogo({
  width = 145,
  height = 44,
  variant = 'light',
  showAdminBadge = false,
}: BrandLogoProps) {
  const isDark = variant === 'dark';
  const nutColor = isDark ? '#FFFFFF' : '#23160C';
  const flixColor = isDark ? '#34D399' : '#1D4A22';
  const leafBright = isDark ? '#4ADE80' : '#26612E';
  const tmColor = isDark ? '#F59E0B' : '#23160C';

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
      <svg
        viewBox="0 0 145 44"
        width={width}
        height={height}
        style={{ display: 'block', overflow: 'visible', maxWidth: '100%' }}
      >
        <defs>
          <linearGradient id={`brandGoldChand_${isDark ? 'dark' : 'light'}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C58526" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#C58526" />
          </linearGradient>
        </defs>
        <g transform="translate(0, 2)">
          {/* 'nut' in rich color */}
          <text
            x="0"
            y="28"
            fontFamily="'Outfit', 'Poppins', 'Montserrat', -apple-system, sans-serif"
            fontSize="33"
            fontWeight="900"
            fill={nutColor}
            letterSpacing="-0.5px"
          >
            nut
          </text>
          {/* 'fl' in green */}
          <text
            x="52"
            y="28"
            fontFamily="'Outfit', 'Poppins', 'Montserrat', -apple-system, sans-serif"
            fontSize="33"
            fontWeight="900"
            fill={flixColor}
            letterSpacing="-0.5px"
          >
            fl
          </text>
          {/* 'ı' stem without dot */}
          <text
            x="78"
            y="28"
            fontFamily="'Outfit', 'Poppins', 'Montserrat', -apple-system, sans-serif"
            fontSize="33"
            fontWeight="900"
            fill={flixColor}
          >
            ı
          </text>
          {/* 'x' in green */}
          <text
            x="88"
            y="28"
            fontFamily="'Outfit', 'Poppins', 'Montserrat', -apple-system, sans-serif"
            fontSize="33"
            fontWeight="900"
            fill={flixColor}
            letterSpacing="-0.5px"
          >
            x
          </text>
          {/* Leaf cluster on 'i' */}
          <g transform="translate(82, 8)">
            <path d="M 0,0 C -3.5,-7 -11,-8 -14,-3 C -16,2 -6,3 0,0 Z" fill={flixColor} />
            <path d="M 0,-1 C 0,-7 7,-11 11,-7 C 13,-2.5 5,-1 0,-1 Z" fill={leafBright} />
            <path d="M 1.5,-1 C 5,-8 15,-9 19,-4 C 21,1.5 9,2.5 1.5,-1 Z" fill={flixColor} />
          </g>
          {/* TM mark */}
          <text
            x="110"
            y="10"
            fontFamily="'Inter', sans-serif"
            fontSize="7.5"
            fontWeight="800"
            fill={tmColor}
          >
            TM
          </text>

          {/* Golden Chand Curve from 'u' to 'l' */}
          <path
            d="M 24,33 C 39,43 60,43 75,33 C 60,39.5 39,39.5 24,33 Z"
            fill={`url(#brandGoldChand_${isDark ? 'dark' : 'light'})`}
          />
        </g>
      </svg>
      {showAdminBadge && (
        <div
          style={{
            fontSize: '0.62rem',
            color: isDark ? '#94a3b8' : '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            fontWeight: 800,
            marginTop: '0.15rem',
            paddingLeft: '2px',
          }}
        >
          ADMIN SUITE
        </div>
      )}
    </div>
  );
}
