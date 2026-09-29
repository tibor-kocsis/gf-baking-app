import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

// A short dip and spring back whenever `trigger` changes, so the baker sees
// which numbers the last tap recalculated. Returns an Animated style.
export function usePulse(trigger) {
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.3, duration: 100, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(scale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }),
      ]),
    ]).start();
  }, [trigger, opacity, scale]);

  return { opacity, transform: [{ scale }] };
}
