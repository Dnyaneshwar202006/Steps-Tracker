import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const history = [
  { id: '1', date: 'Today', steps: 8420, goal: 10000 },
  { id: '2', date: 'Yesterday', steps: 7231, goal: 10000 },
  { id: '3', date: 'Sep 10', steps: 9842, goal: 10000 },
  { id: '4', date: 'Sep 9', steps: 8420, goal: 10000 },
  { id: '5', date: 'Sep 8', steps: 11240, goal: 10000 },
  { id: '6', date: 'Sep 7', steps: 6389, goal: 10000 },
  { id: '7', date: 'Sep 6', steps: 10125, goal: 10000 },
  { id: '8', date: 'Sep 5', steps: 9203, goal: 10000 },
  { id: '9', date: 'Sep 4', steps: 12480, goal: 10000 },
  { id: '10', date: 'Sep 3', steps: 5647, goal: 10000 },
  { id: '11', date: 'Sep 2', steps: 8891, goal: 10000 },
  { id: '12', date: 'Sep 1', steps: 10340, goal: 10000 },
  { id: '13', date: 'Aug 31', steps: 7502, goal: 10000 },
  { id: '14', date: 'Aug 30', steps: 9987, goal: 10000 },
  { id: '15', date: 'Aug 29', steps: 11875, goal: 10000 },
  { id: '16', date: 'Aug 28', steps: 6120, goal: 10000 },
  { id: '17', date: 'Aug 27', steps: 8756, goal: 10000 },
  { id: '18', date: 'Aug 26', steps: 10620, goal: 10000 },
  { id: '19', date: 'Aug 25', steps: 9314, goal: 10000 },
  { id: '20', date: 'Aug 24', steps: 7893, goal: 10000 },
];
function HistoryScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>History</Text>
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const progress = Math.min(item.steps/item.goal, 1);
            return(
            <View style={styles.items}>
              <View style={styles.itemHeader}>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.percentage}>{Math.round(progress * 100)}%</Text>
              </View>
              <Text style={styles.steps}>{item.steps.toLocaleString()}</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progress, {width: `${progress * 100}%`}]} />
              </View>
            </View>
          )}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
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
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 120,
  },
  items: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  percentage: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  steps: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#111827',
    borderRadius: 3,
  }
});

export default HistoryScreen;
