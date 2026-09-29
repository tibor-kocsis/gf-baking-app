import Svg, { Path, Circle } from 'react-native-svg';

// Stroke icons drawn in-app, so they look the same on every platform (emoji
// render as empty boxes on web without an emoji font).
const SHAPES = {
  loaf: (
    <>
      <Path d="M5 11a4 4 0 0 1 1-7.8h12A4 4 0 0 1 19 11v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z" />
      <Path d="M9 8.5l1.5-2M13 8.5l1.5-2" />
    </>
  ),
  back: <Path d="M15 5l-7 7 7 7" />,
  chevronRight: <Path d="M9 5l7 7-7 7" />,
  chevronDown: <Path d="M5 9l7 7 7-7" />,
  arrowRight: <Path d="M5 12h14M13 6l6 6-6 6" />,
  globe: (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
    </>
  ),
  check: <Path d="M5 12.5l4.5 4.5L19 7.5" />,
  minus: <Path d="M5 12h14" />,
  plus: <Path d="M12 5v14M5 12h14" />,
  timer: (
    <>
      <Circle cx="12" cy="13.5" r="7.5" />
      <Path d="M12 13.5V9.5M9.5 2.5h5M18.5 6.5l1.5-1.5" />
    </>
  ),
  play: <Path d="M8 5v14l11-7Z" />,
  camera: (
    <>
      <Path d="M4 8h3l2-3h6l2 3h3v11H4Z" />
      <Circle cx="12" cy="13" r="3.5" />
    </>
  ),
};

// Shapes drawn filled rather than stroked.
const FILLED = { play: true };

export function Icon({ name, size = 24, color, strokeWidth = 1.8 }) {
  const filled = FILLED[name];
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : 'none'}
      stroke={filled ? 'none' : color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {SHAPES[name]}
    </Svg>
  );
}
