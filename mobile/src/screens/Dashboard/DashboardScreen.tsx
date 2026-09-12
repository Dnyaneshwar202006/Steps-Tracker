import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashboardHeader from './components/DashBoardHeader';
import StepsProgressCard from './components/StepsProgressCard';
import ActivitySummary from './components/ActivitySummary';

function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <DashboardHeader />
        <StepsProgressCard />
        <ActivitySummary />
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
  },
});

export default DashboardScreen;

