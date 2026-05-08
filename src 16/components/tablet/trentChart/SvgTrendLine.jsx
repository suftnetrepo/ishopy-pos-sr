/* eslint-disable prettier/prettier */
/**
 * SvgTrendLine
 * Pure SVG smooth-line area chart. No UI chrome — use TrendCharts for that.
 * Outer container uses fluent-styles Stack.
 */
import React, {useMemo} from 'react';
import Svg, {Path, Defs, LinearGradient, Stop, Circle, Line, Text as SvgText} from 'react-native-svg';
import {Stack} from '../../../components/package/stack';

const SvgTrendLine = ({
  data = [],
  labels = [],
  width = 300,
  height = 180,
  lineColor = '#3b82f6',
  gradientFrom = 'rgba(59,130,246,0.25)',
  gradientTo = 'rgba(59,130,246,0)',
  showDots = true,
  dotColor,
  labelColor = '#71717a',
  gridColor = '#e4e4e7',
  gridLines = 4,
  formatLabel = v => String(Math.round(v)),
}) => {
  const paddingLeft   = 44;
  const paddingRight  = 16;
  const paddingTop    = 16;
  const paddingBottom = 28;
  const chartWidth    = width  - paddingLeft - paddingRight;
  const chartHeight   = height - paddingTop  - paddingBottom;
  const resolvedDot   = dotColor || lineColor;

  const {minVal, maxVal, points} = useMemo(() => {
    if (!data || data.length === 0) return {minVal: 0, maxVal: 0, points: []};
    const min   = Math.min(...data);
    const max   = Math.max(...data);
    const range = max - min || 1;
    const pts   = data.map((v, i) => ({
      x: paddingLeft + (i / Math.max(data.length - 1, 1)) * chartWidth,
      y: paddingTop  + chartHeight - ((v - min) / range)  * chartHeight,
      value: v,
    }));
    return {minVal: min, maxVal: max, points: pts};
  }, [data, chartWidth, chartHeight]);

  const buildPath = pts => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cpx = pts[i].x + (pts[i + 1].x - pts[i].x) * 0.5;
      d += ` C ${cpx} ${pts[i].y}, ${cpx} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
    }
    return d;
  };

  const linePath = buildPath(points);
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  const yGrid = Array.from({length: gridLines + 1}, (_, i) => {
    const frac  = i / gridLines;
    const y     = paddingTop + chartHeight - frac * chartHeight;
    const value = minVal + frac * (maxVal - minVal);
    return {y, value};
  });

  return (
    <Stack>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={gradientFrom} stopOpacity="1" />
            <Stop offset="100%" stopColor={gradientTo}   stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {yGrid.map((gl, idx) => (
          <React.Fragment key={idx}>
            <Line x1={paddingLeft} y1={gl.y} x2={width - paddingRight} y2={gl.y}
              stroke={gridColor} strokeWidth={1} />
            <SvgText x={paddingLeft - 6} y={gl.y + 4} fontSize={9}
              fill={labelColor} textAnchor="end" fontFamily="System">
              {formatLabel(gl.value)}
            </SvgText>
          </React.Fragment>
        ))}

        {areaPath ? <Path d={areaPath} fill="url(#areaGrad)" /> : null}

        {linePath ? (
          <Path d={linePath} fill="none" stroke={lineColor}
            strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        ) : null}

        {showDots && points.map((pt, idx) => (
          <Circle key={idx} cx={pt.x} cy={pt.y} r={4}
            fill="#fff" stroke={resolvedDot} strokeWidth={2} />
        ))}

        {labels.map((lbl, idx) => {
          const x = paddingLeft + (idx / Math.max(labels.length - 1, 1)) * chartWidth;
          return (
            <SvgText key={idx} x={x} y={height - 6} fontSize={10}
              fill={labelColor} textAnchor="middle" fontFamily="System">
              {lbl}
            </SvgText>
          );
        })}
      </Svg>
    </Stack>
  );
};

export default SvgTrendLine;