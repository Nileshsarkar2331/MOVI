import React from 'react';
import { Svg, Defs, LinearGradient, Stop, Circle, Text as SvgText, G, Line, Rect, Path } from 'react-native-svg';

interface LogoSvgProps {
  width?: number;
  height?: number;
}

export function LogoSvg({ width = 40, height = 40 }: LogoSvgProps) {
  // Scale factor from the original 1024x1024 viewBox to the desired size
  return (
    <Svg width={width} height={height} viewBox="0 0 1024 1024" fill="none">
      <Defs>
        <LinearGradient id="ringGradient" x1="0" y1="0" x2="1024" y2="1024">
          <Stop offset="0%" stopColor="#FF8A00" />
          <Stop offset="50%" stopColor="#F5F5F5" />
          <Stop offset="100%" stopColor="#14A800" />
        </LinearGradient>
        <LinearGradient id="pinGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FF5A36" />
          <Stop offset="100%" stopColor="#FF1E1E" />
        </LinearGradient>
      </Defs>

      {/* Outer Ring */}
      <Circle cx="512" cy="512" r="430" stroke="url(#ringGradient)" strokeWidth="18" fill="white" />

      {/* Letter M */}
      <SvgText
        x="170"
        y="610"
        fontSize="250"
        fontFamily="Arial"
        fontWeight="700"
        fill="black"
      >
        M
      </SvgText>

      {/* Wheel O */}
      <Circle cx="470" cy="520" r="75" stroke="url(#ringGradient)" strokeWidth="10" fill="white" />

      {/* Wheel spokes */}
      <G stroke="black" strokeWidth="8" strokeLinecap="round">
        <Line x1="470" y1="455" x2="470" y2="585" />
        <Line x1="405" y1="520" x2="535" y2="520" />
        <Line x1="425" y1="475" x2="515" y2="565" />
        <Line x1="515" y1="475" x2="425" y2="565" />
        <Line x1="445" y1="460" x2="495" y2="580" />
        <Line x1="495" y1="460" x2="445" y2="580" />
      </G>

      {/* Hub */}
      <Circle cx="470" cy="520" r="14" fill="black" />

      {/* Letter V */}
      <SvgText
        x="575"
        y="610"
        fontSize="250"
        fontFamily="Arial"
        fontWeight="700"
        fill="black"
      >
        V
      </SvgText>

      {/* Letter i */}
      <Rect x="805" y="430" width="35" height="180" rx="8" fill="black" />

      {/* Map Pin */}
      <Path
        d="M822 360C790 360 766 384 766 416C766 458 822 518 822 518C822 518 878 458 878 416C878 384 854 360 822 360Z"
        fill="url(#pinGradient)"
      />
      <Circle cx="822" cy="416" r="15" fill="white" />
    </Svg>
  );
}
