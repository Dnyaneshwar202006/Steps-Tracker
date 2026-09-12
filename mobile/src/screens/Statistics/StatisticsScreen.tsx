import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  }
});

export default StatisticsScreen;