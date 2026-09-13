import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const weeklyData = [
  { day: 'M', steps: 7231 },
  { day: 'T', steps: 8420 },
  { day: 'W', steps: 9843 },
  { day: 'Th', steps: 6520 },
  { day: 'F', steps: 5567 },
  { day: 'Sat', steps: 11240 },
  { day: 'Sun', steps: 3450 },
];
function StepBar({ steps }: { steps: number }) {
  const height = useSharedValue(0);
  const targeHeight = Math.min((steps / 12000) * 140, 140);
  useEffect(() => {
    height.value = withTiming(targeHeight, { duration: 1000 });
  }, [targeHeight, height]);
  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));
  return <Animated.View style={[styles.bar, animatedStyle]} />;
}
function StatisticsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>Statistics</Text>
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>This Week</Text>
          <Text style={styles.avg}>8,420</Text>
          <Text style={styles.avgLabel}>average steps</Text>
        </View>
        <View style={styles.chart}>
          {weeklyData.map(day => (
            <StepBar key={day.day} steps={day.steps} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  avg: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
  },
  avgLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  chart: {
    height: 180,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 28,
    minHeight: 8,
    backgroundColor: '#111827',
    borderRadius: 8,
  },
  day: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
  },
});

export default StatisticsScreen;
