# react-native-logo-draw

A reusable React Native component that **traces a logo outline like a pen and then reveals its fill**. It is the React Native counterpart to [swiftui-logo-draw](https://github.com/RhuanCruz/swiftui-logo-draw).

## Install

```bash
npm install react-native-logo-draw react-native-svg
```

## Usage

```tsx
import { LogoDraw } from 'react-native-logo-draw';

<LogoDraw
  path="M10 50 ..."
  pathLength={420}
  size={160}
  drawDuration={1200}
  fillStartPercent={70}
  fillDuration={350}
  outlineColor="#111827"
  fillColor="#111827"
  onComplete={() => navigation.replace('Home')}
/>
```

`pathLength` is the measured length of the supplied SVG path. The component uses it to animate `strokeDashoffset`; it is not the SVG `pathLength` attribute. Keep the outline path clean, non-self-intersecting, and ordered in the direction you want the logo drawn.

## API

| Prop | Default | Description |
|---|---:|---|
| `drawDuration` | `1200` | Outline duration in milliseconds. |
| `drawEasing` | `smooth` | `smooth`, `snappy`, `easeInOut`, or `linear`. |
| `fillsLogo` | `true` | Set false for outline-only animation. |
| `fillStartPercent` | `70` | Point in the outline animation where fill begins. |
| `fillDuration` | `350` | Fill fade duration in milliseconds. |
| `replayTrigger` | `0` | Change this value to replay. |
| `freezeAt` | — | Fixed progress from `0` to `1`, useful for screenshots. |
| `onComplete` | — | Called after the fill finishes. |

## Converting a logo

Start with a high-resolution monochrome SVG or PNG. Convert the artwork to one or more SVG paths, normalize the viewBox to `0 0 100 100`, and measure the path length with an SVG path measurement tool. The path should represent the visible boundary, not a bitmap trace with thousands of noisy points. Preserve subpath order to control the drawing sequence.

## Accessibility

The component exposes an accessible image label and honors reduced-motion preferences when available by showing the completed logo immediately.

MIT License. Inspired by the animation model in the original SwiftUI project; this implementation is independent and written for React Native.
