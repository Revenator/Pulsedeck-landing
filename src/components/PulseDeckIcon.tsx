import React from "react";

interface PulseDeckIconProps {
  className?: string;
  glow?: boolean;
}

export default function PulseDeckIcon({ className = "w-10 h-10", glow = true }: PulseDeckIconProps) {
  return (
    <svg 
      viewBox="0 0 500 500" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient for strokes */}
        <linearGradient id="pulsedeckGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan-400 */}
          <stop offset="50%" stopColor="#3b82f6" /> {/* Blue-500 */}
          <stop offset="100%" stopColor="#1d4ed8" /> {/* Blue-700 */}
        </linearGradient>
        
        {/* Dark Circle Fill Gradient */}
        <linearGradient id="pulsedeckCircleFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* Glow effect */}
        <filter id="pulsedeckGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dark Circle Base with Stroke */}
      <circle 
        cx="250" 
        cy="250" 
        r="215" 
        fill="url(#pulsedeckCircleFill)" 
        stroke="url(#pulsedeckGrad)" 
        strokeWidth="6" 
        filter={glow ? "url(#pulsedeckGlow)" : undefined} 
      />

      {/* Top [>_] Prompt Indicator */}
      <g transform="translate(205, 110)">
        {/* Left bracket [ */}
        <path 
          d="M 5,0 L -12,0 L -12,32 L 5,32" 
          stroke="url(#pulsedeckGrad)" 
          strokeWidth="4.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Prompt > */}
        <path 
          d="M -2,9 L 7,16 L -2,23" 
          stroke="url(#pulsedeckGrad)" 
          strokeWidth="4.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Cursor _ */}
        <line 
          x1="13" 
          y1="23" 
          x2="26" 
          y2="23" 
          stroke="url(#pulsedeckGrad)" 
          strokeWidth="4.5" 
          strokeLinecap="round" 
        />
        
        {/* Right bracket ] */}
        <path 
          d="M 23,0 L 40,0 L 40,32 L 23,32" 
          stroke="url(#pulsedeckGrad)" 
          strokeWidth="4.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          transform="translate(18, 0)"
        />
      </g>

      {/* Heartbeat/Pulse Signal on Left */}
      <path 
        d="M 115,250 L 155,250 L 170,200 L 185,320 L 205,160 L 220,350 L 235,230 L 250,270 L 265,250 L 295,250" 
        stroke="url(#pulsedeckGrad)" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Link cables to three terminals */}
      <path 
        d="M 295,250 L 315,250 
           M 315,250 L 315,185 L 335,185
           M 315,250 L 335,250
           M 315,250 L 315,315 L 335,315" 
        stroke="url(#pulsedeckGrad)" 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Terminal Window 1 (Top) */}
      <g transform="translate(335, 150)">
        <rect 
          x="0" 
          y="0" 
          width="75" 
          height="52" 
          rx="7" 
          fill="#090d16" 
          stroke="url(#pulsedeckGrad)" 
          strokeWidth="4.5" 
        />
        {/* Header Divider */}
        <line 
          x1="0" 
          y1="15" 
          x2="75" 
          y2="15" 
          stroke="url(#pulsedeckGrad)" 
          strokeWidth="2.5" 
        />
        {/* Control dots */}
        <circle cx="11" cy="7.5" r="2.5" fill="url(#pulsedeckGrad)" />
        <circle cx="21" cy="7.5" r="2.5" fill="url(#pulsedeckGrad)" />
        <circle cx="31" cy="7.5" r="2.5" fill="url(#pulsedeckGrad)" />
        {/* >_ Terminal Prompt */}
        <path 
          d="M 13,27 L 22,32 L 13,37" 
          stroke="url(#pulsedeckGrad)" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <line 
          x1="26" 
          y1="37" 
          x2="37" 
          y2="37" 
          stroke="url(#pulsedeckGrad)" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
        />
      </g>

      {/* Terminal Window 2 (Middle) */}
      <g transform="translate(335, 215)">
        <rect 
          x="0" 
          y="0" 
          width="75" 
          height="52" 
          rx="7" 
          fill="#090d16" 
          stroke="url(#pulsedeckGrad)" 
          strokeWidth="4.5" 
        />
        {/* Header Divider */}
        <line 
          x1="0" 
          y1="15" 
          x2="75" 
          y2="15" 
          stroke="url(#pulsedeckGrad)" 
          strokeWidth="2.5" 
        />
        {/* Control dots */}
        <circle cx="11" cy="7.5" r="2.5" fill="url(#pulsedeckGrad)" />
        <circle cx="21" cy="7.5" r="2.5" fill="url(#pulsedeckGrad)" />
        <circle cx="31" cy="7.5" r="2.5" fill="url(#pulsedeckGrad)" />
        {/* >_ Terminal Prompt */}
        <path 
          d="M 13,27 L 22,32 L 13,37" 
          stroke="url(#pulsedeckGrad)" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <line 
          x1="26" 
          y1="37" 
          x2="37" 
          y2="37" 
          stroke="url(#pulsedeckGrad)" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
        />
      </g>

      {/* Terminal Window 3 (Bottom) */}
      <g transform="translate(335, 280)">
        <rect 
          x="0" 
          y="0" 
          width="75" 
          height="52" 
          rx="7" 
          fill="#090d16" 
          stroke="url(#pulsedeckGrad)" 
          strokeWidth="4.5" 
        />
        {/* Header Divider */}
        <line 
          x1="0" 
          y1="15" 
          x2="75" 
          y2="15" 
          stroke="url(#pulsedeckGrad)" 
          strokeWidth="2.5" 
        />
        {/* Control dots */}
        <circle cx="11" cy="7.5" r="2.5" fill="url(#pulsedeckGrad)" />
        <circle cx="21" cy="7.5" r="2.5" fill="url(#pulsedeckGrad)" />
        <circle cx="31" cy="7.5" r="2.5" fill="url(#pulsedeckGrad)" />
        {/* >_ Terminal Prompt */}
        <path 
          d="M 13,27 L 22,32 L 13,37" 
          stroke="url(#pulsedeckGrad)" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <line 
          x1="26" 
          y1="37" 
          x2="37" 
          y2="37" 
          stroke="url(#pulsedeckGrad)" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
        />
      </g>
    </svg>
  );
}
