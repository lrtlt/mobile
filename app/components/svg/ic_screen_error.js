import * as React from 'react';
import Svg, {Circle, ClipPath, Defs, G, Line, Path, Rect} from 'react-native-svg';

// Retro TV showing a glitched test pattern in LRT channel colours ("technical difficulties").
// w=160 h=136

// SMPTE-like bars: white, Opus, LRT HD, LRT World, LRT Plius, LR, LRT.
const BARS = ['#EEF0F7', '#F2B12E', '#83A8D9', '#6D9B36', '#A91B73', '#C4242C', '#333399'];
const BARS_REVERSED = ['#333399', '#1D2142', '#A91B73', '#1D2142', '#83A8D9', '#1D2142', '#EEF0F7'];
const DARK = '#1D2142';

const SCREEN_X = 18;
const SCREEN_Y = 44;
const SCREEN_W = 100;
const SCREEN_H = 70;
const BAR_W = SCREEN_W / BARS.length;

// Renders one extra wrap-around bar on each side so shifted (glitched) rows still fill the screen.
const renderBars = (colors, y, height, offset = 0) =>
  [-1, ...colors.keys(), colors.length].map((i) => (
    <Rect
      key={`${y}-${i}`}
      x={SCREEN_X + offset + i * BAR_W}
      y={y}
      width={BAR_W + 0.5}
      height={height}
      fill={colors[(i + colors.length) % colors.length]}
    />
  ));

function SvgComponent({size = 140, color = DARK, bodyColor = '#F9F9F9', ...props}) {
  return (
    <Svg width={size} height={(size * 136) / 160} viewBox="0 0 160 136" fill="none" {...props}>
      <Defs>
        <ClipPath id="lrtScreenErrorClip">
          <Rect x={SCREEN_X} y={SCREEN_Y} width={SCREEN_W} height={SCREEN_H} rx={8} />
        </ClipPath>
      </Defs>

      {/* Antennas */}
      <Line x1={80} y1={30} x2={56} y2={8} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <Line x1={80} y1={30} x2={106} y2={4} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <Circle cx={56} cy={8} r={4} fill={color} />
      <Circle cx={106} cy={4} r={4} fill={color} />
      <Rect x={68} y={24} width={24} height={10} rx={5} fill={color} />

      {/* Feet */}
      <Rect x={28} y={122} width={16} height={12} rx={3} fill={color} />
      <Rect x={116} y={122} width={16} height={12} rx={3} fill={color} />

      {/* Body */}
      <Rect x={6} y={32} width={148} height={94} rx={16} fill={bodyColor} stroke={color} strokeWidth={4} />

      {/* Screen: test pattern with glitched bands */}
      <G clipPath="url(#lrtScreenErrorClip)">
        {renderBars(BARS, SCREEN_Y, 48)}
        {renderBars(BARS_REVERSED, 92, 8)}
        <Rect x={SCREEN_X} y={100} width={SCREEN_W} height={14} fill={DARK} />
        <Rect x={36} y={100} width={18} height={14} fill="#EEF0F7" />
        <Rect x={54} y={100} width={18} height={14} fill="#2C478B" />
        {renderBars(BARS, 64, 7, 10)}
        {renderBars(BARS, 77, 3, -6)}
        <Path d="M18 44h46L18 90z" fill="#FFFFFF" opacity={0.12} />
      </G>
      <Rect
        x={SCREEN_X}
        y={SCREEN_Y}
        width={SCREEN_W}
        height={SCREEN_H}
        rx={8}
        stroke={color}
        strokeWidth={3}
      />

      {/* Controls */}
      <Circle cx={136} cy={60} r={7} stroke={color} strokeWidth={3} />
      <Line x1={136} y1={60} x2={136} y2={55} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <Circle cx={136} cy={81} r={4.5} stroke={color} strokeWidth={3} />
      <Line x1={129} y1={97} x2={143} y2={97} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <Line x1={129} y1={104} x2={143} y2={104} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <Line x1={129} y1={111} x2={143} y2={111} stroke={color} strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}

export default SvgComponent;
