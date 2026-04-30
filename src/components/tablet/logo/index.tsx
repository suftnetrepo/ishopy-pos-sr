/* eslint-disable prettier/prettier */
import React from 'react';
import Svg, {Rect, Path, Text as SvgText, G} from 'react-native-svg';

/**
 * Kursa Logo — Option D
 * Shopping bag with K cutout mark on amber rounded square.
 * Works for restaurant, retail, bar and takeaway contexts.
 */
const Logo = () => {
  return (
    <Svg width={120} height={44} viewBox="0 0 120 44">

      {/* ── Icon mark: amber rounded square ── */}
      <Rect x="0" y="2" width="40" height="40" rx="10" fill="#f59e0b" />

      {/* Bag body */}
      <Rect x="9" y="19" width="22" height="17" rx="3" fill="#1c1917" />

      {/* Bag handle */}
      <Path
        d="M14 19 Q14 12 20 12 Q26 12 26 19"
        fill="none"
        stroke="#1c1917"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* K cutout — spine */}
      <Rect x="13" y="23" width="3" height="9" rx="1" fill="#f59e0b" />

      {/* K cutout — upper arm */}
      <Path
        d="M16 27.5 L22 23"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* K cutout — lower arm */}
      <Path
        d="M16 28.5 L22 33"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* ── Wordmark ── */}
      <SvgText
        x="48"
        y="28"
        fontFamily="System"
        fontSize="22"
        fontWeight="700"
        fill="#18181b"
        letterSpacing="-0.5">
        Kursa
      </SvgText>

    </Svg>
  );
};

export default Logo;