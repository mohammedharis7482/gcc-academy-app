import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';

import { AppText } from '@/components/common/app-text';
import { colors, fontFamilies, radius, spacing } from '@/design/tokens';
import { MonthlyDevelopmentPoint } from '@/types/progress';
import { ProgressCard } from './progress-card';

export function MonthlyDevelopmentChart({ points }: { points: MonthlyDevelopmentPoint[] }) {
  const left = 24;
  const right = 296;
  const top = 18;
  const bottom = 142;
  const minScore = 50;
  const maxScore = 85;
  const coordinates = points.map((point, index) => {
    const x = left + (index * (right - left)) / Math.max(1, points.length - 1);
    const normalized = (point.score - minScore) / (maxScore - minScore);
    const y = bottom - normalized * (bottom - top);
    return { ...point, x, y };
  });
  const linePoints = coordinates.map(({ x, y }) => `${x},${y}`).join(' ');
  const firstScore = points[0]?.score ?? 0;
  const lastScore = points.at(-1)?.score ?? 0;
  return <ProgressCard accessibilityLabel={`Monthly development increased from ${firstScore} to ${lastScore}`}><View style={styles.header}><View style={styles.headerCopy}><AppText variant="heading" weight="bold">Monthly Development</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary}>Overall score · last seven months</AppText></View><View style={styles.change}><MaterialCommunityIcons name="trending-up" size={17} color={colors.status.success} /><AppText variant="bodySmall" weight="bold" color={colors.status.success}>+{lastScore - firstScore}</AppText></View></View><View style={styles.chart}><Svg width="100%" height={136} viewBox="0 0 320 174">
    {[60, 70, 80].map((score) => { const y = bottom - ((score - minScore) / (maxScore - minScore)) * (bottom - top); return <Line key={score} x1={left} x2={right} y1={y} y2={y} stroke={colors.neutral.divider} strokeWidth={1} strokeDasharray="4 5" />; })}
    <Polyline points={linePoints} fill="none" stroke={colors.brand.blue} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
    {coordinates.map(({ month, score, x, y }, index) => <Circle key={`${month}-point`} cx={x} cy={y} r={index === coordinates.length - 1 ? 5 : 3.5} fill={colors.neutral.white} stroke={index === coordinates.length - 1 ? colors.brand.navy : colors.brand.blue} strokeWidth={2.5} />)}
    {coordinates.map(({ month, x }) => <SvgText key={`${month}-label`} x={x} y={164} fill={colors.neutral.textSecondary} fontFamily={fontFamilies.semibold} fontSize={11} textAnchor="middle">{month}</SvgText>)}
    {coordinates.length ? <SvgText x={coordinates[coordinates.length - 1].x} y={coordinates[coordinates.length - 1].y - 11} fill={colors.brand.navy} fontFamily={fontFamilies.bold} fontSize={11} textAnchor="middle">{lastScore}</SvgText> : null}
  </Svg></View><View style={styles.insight}><View style={styles.insightIcon}><MaterialCommunityIcons name="chart-timeline-variant-shimmer" size={18} color={colors.brand.blue} /></View><AppText variant="bodySmall" color={colors.neutral.textSecondary} style={styles.insightCopy}>Steady gains since April.</AppText></View></ProgressCard>;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  headerCopy: { flex: 1, minWidth: 0 },
  change: { paddingHorizontal: spacing.sm, minHeight: 32, borderRadius: radius.pill, backgroundColor: colors.status.successSoft, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  chart: { marginTop: spacing.xs },
  insight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.neutral.backgroundRaised },
  insightIcon: { width: 36, height: 36, borderRadius: radius.small, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' },
  insightCopy: { flex: 1, minWidth: 0 },
});
