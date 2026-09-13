import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getHistory } from '../../services/healthConnect.service';

function HistoryScreen() {
  const [history, setHistory] = useState<Record<string, number>>({});
  useEffect(()=>{
    async function loadHistory(){
      const data = await getHistory();
      setHistory(data);
    }
    loadHistory(); 
  },[])
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>History</Text>
        <FlatList
          data={Object.entries(history)}
          keyExtractor={item => item[0]}
          renderItem={({ item }) => {
            const progress = Math.min(item[1]/10000, 1);
            return(
            <View style={styles.items}>
              <View style={styles.itemHeader}>
                <Text style={styles.date}>{item[0]}</Text>
                <Text style={styles.percentage}>{Math.round(progress * 100)}%</Text>
              </View>
              <Text style={styles.steps}>{item[1].toLocaleString()}</Text>
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
