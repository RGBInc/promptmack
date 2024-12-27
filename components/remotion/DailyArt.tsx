import React from 'react';
import { useTheme } from 'next-themes';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

interface DailyArtProps {
  seed?: number; // Used to generate unique daily variations
}

export const DailyArt: React.FC<DailyArtProps> = ({ seed = Date.now() }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Colors based on theme
  const primaryColor = isDark ? '#ffffff' : '#000000';
  const backgroundColor = isDark ? '#1a1a1a' : '#ffffff';
  const accentColor = isDark ? '#7c3aed' : '#4f46e5';

  // Use seed to create daily variations
  const dailyOffset = Math.sin(seed) * 1000;
  
  // Animation values
  const rotation = interpolate(
    frame,
    [0, 120],
    [0, 360],
    {
      extrapolateRight: 'loop',
    }
  );

  const scale = interpolate(
    frame,
    [0, 30, 60],
    [1, 1.2, 1],
    {
      extrapolateRight: 'loop',
    }
  );

  // Generate artistic patterns based on the day
  const generatePattern = () => {
    const patterns = [];
    const numShapes = 12;
    
    for (let i = 0; i < numShapes; i++) {
      const angle = (i * 360) / numShapes + dailyOffset;
      const x = Math.cos((angle * Math.PI) / 180) * 100;
      const y = Math.sin((angle * Math.PI) / 180) * 100;
      
      patterns.push(
        <g
          key={i}
          transform={`translate(${width / 2 + x}, ${height / 2 + y}) 
                     rotate(${rotation + angle}) 
                     scale(${scale})`}
        >
          <path
            d={`M 0 -20 
                C 20 -20, 20 20, 0 20
                C -20 20, -20 -20, 0 -20`}
            fill={accentColor}
            opacity={0.8}
            stroke={primaryColor}
            strokeWidth={1}
          />
        </g>
      );
    }
    
    return patterns;
  };

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <svg width={width} height={height}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background patterns */}
        <g opacity={0.1}>
          {Array.from({ length: 20 }).map((_, i) => (
            <circle
              key={`bg-${i}`}
              cx={width / 2}
              cy={height / 2}
              r={i * 20 + dailyOffset % 20}
              fill="none"
              stroke={primaryColor}
              strokeWidth={0.5}
            />
          ))}
        </g>

        {/* Main animated pattern */}
        <g filter="url(#glow)">
          {generatePattern()}
        </g>

        {/* Central logo or icon */}
        <g
          transform={`translate(${width / 2}, ${height / 2}) 
                     rotate(${rotation / 2})`}
        >
          <circle
            r={30}
            fill={backgroundColor}
            stroke={accentColor}
            strokeWidth={2}
          />
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={primaryColor}
            fontSize="24"
            fontFamily="system-ui"
          >
            P
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
