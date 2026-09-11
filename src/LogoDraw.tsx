import React, { useEffect, useMemo, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, View, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type EasingName = 'smooth' | 'snappy' | 'easeInOut' | 'linear';

export type LogoDrawProps = {
  path: string;
  pathLength: number;
  size?: number;
  drawDuration?: number;
  drawEasing?: EasingName;
  fillsLogo?: boolean;
  fillStartPercent?: number;
  fillDuration?: number;
  strokeWidth?: number;
  outlineColor?: string;
  fillColor?: string;
  replayTrigger?: number;
  freezeAt?: number;
  accessibilityLabel?: string;
  onComplete?: () => void;
  style?: ViewStyle;
};

export function LogoDraw({
  path,
  pathLength,
  size = 160,
  drawDuration = 1200,
  drawEasing = 'smooth',
  fillsLogo = true,
  fillStartPercent = 70,
  fillDuration = 350,
  strokeWidth = 1.5,
  outlineColor = '#000',
  fillColor = '#000',
  replayTrigger = 0,
  freezeAt,
  accessibilityLabel = 'Logo',
  onComplete,
  style,
}: LogoDrawProps) {
  const trim = useRef(new Animated.Value(0)).current;
  const fill = useRef(new Animated.Value(0)).current;
  const reducedMotion = useRef(false);
  const clampedStart = Math.min(100, Math.max(0, fillStartPercent));
  const clampedFreeze = freezeAt == null ? undefined : Math.min(1, Math.max(0, freezeAt));

  const easing = useMemo(() => {
    switch (drawEasing) {
      case 'linear': return Easing.linear;
      case 'easeInOut': return Easing.inOut(Easing.ease);
      case 'snappy': return Easing.out(Easing.cubic);
      default: return Easing.inOut(Easing.cubic);
    }
  }, [drawEasing]);

  useEffect(() => {
    let cancelled = false;
    const start = async () => {
      reducedMotion.current = await AccessibilityInfo.isReduceMotionEnabled?.() ?? false;
      if (cancelled) return;
      trim.stopAnimation();
      fill.stopAnimation();
      trim.setValue(clampedFreeze ?? (reducedMotion.current ? 1 : 0));
      fill.setValue(clampedFreeze != null ? (clampedFreeze * 100 >= clampedStart ? 1 : 0) : (reducedMotion.current && fillsLogo ? 1 : 0));
      if (clampedFreeze != null || reducedMotion.current) { onComplete?.(); return; }

      const draw = Animated.timing(trim, { toValue: 1, duration: drawDuration, easing, useNativeDriver: false });
      draw.start(({ finished }) => { if (finished && !fillsLogo && !cancelled) onComplete?.(); });
      const fillDelay = drawDuration * clampedStart / 100;
      const timer = setTimeout(() => {
        if (cancelled) return;
        Animated.timing(fill, { toValue: 1, duration: fillDuration, easing: Easing.inOut(Easing.ease), useNativeDriver: false }).start(({ finished }) => { if (finished && !cancelled) onComplete?.(); });
      }, fillDelay);
      cleanup = () => { clearTimeout(timer); draw.stop(); fill.stopAnimation(); };
    };
    let cleanup = () => {};
    start();
    return () => { cancelled = true; cleanup(); };
  }, [replayTrigger, path, drawDuration, easing, fillsLogo, clampedStart, fillDuration, clampedFreeze, onComplete, trim, fill]);

  const dashOffset = trim.interpolate({ inputRange: [0, 1], outputRange: [pathLength, 0] });
  return (
    <View accessible accessibilityLabel={accessibilityLabel} accessibilityRole="image" style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <AnimatedPath d={path} fill="none" stroke={outlineColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${pathLength} ${pathLength}`} strokeDashoffset={dashOffset} />
        {fillsLogo && <AnimatedPath d={path} fill={fillColor} opacity={fill} />}
      </Svg>
    </View>
  );
}

export default LogoDraw;
