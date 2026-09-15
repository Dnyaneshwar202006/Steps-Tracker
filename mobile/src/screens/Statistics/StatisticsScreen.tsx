import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { getHistory } from '../../services/steps.service';

type HistoryItem = {
  id: string;
  userId: string;
  date: string;
  steps: number;
  createdAt: string;
};

function StepBar({ day, steps }: { day: string; steps: number }) {
  const height = useSharedValue(0);
  const targeHeight = Math.min((steps / 12000) * 140, 140);

  useEffect(() => {
    height.value = withTiming(targeHeight, { duration: 1000 });
  }, [targeHeight, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <View style={styles.barContainer}>
      <Animated.View style={[styles.bar, animatedStyle]} />
      <Text style={styles.day}>{day}</Text>
    </View>
  );
}

function StatisticsScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [weeklyData, setWeeklyData] = useState<
    { day: string; steps: number }[]
  >([]);

  const averageSteps =
    weeklyData.length > 0
      ? Math.round(
          weeklyData.reduce((total, item) => total + item.steps, 0) /
            weeklyData.length,
        )
      : 0;

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getHistory();

        const historyData = data.result;

        setHistory(historyData);

        const weekly = historyData.slice(-7).map((item: HistoryItem) => {
          const [year, month, day] = item.date.split('-').map(Number);

          return {
            day: new Date(year, month - 1, day).toLocaleDateString('en-US', {
              weekday: 'short',
            }),
            steps: item.steps,
          };
        });

        setWeeklyData(weekly);
      } catch (error) {
        console.error('Error: while fetching statistics', error);
      }
    }

    loadHistory();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>Statistics</Text>

        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>This Week</Text>

          <Text style={styles.avg}>
            {averageSteps.toLocaleString()}
          </Text>

          <Text style={styles.avgLabel}>average steps</Text>
        </View>

        <View style={styles.chart}>
          {weeklyData.map((item, index) => (
            <StepBar
              key={`${item.day}-${index}`}
              day={item.day}
              steps={item.steps}
            />
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