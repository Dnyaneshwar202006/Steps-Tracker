import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashboardHeader from './components/DashBoardHeader';
import StepsProgressCard from './components/StepsProgressCard';
import ActivitySummary from './components/ActivitySummary';
import {
  initializeHealthConnect,
  requestPermissions,
} from '../../services/healthConnect.service';
import { useEffect } from 'react';

function DashboardScreen() {
  useEffect(() => {
    async function setupHealthConnect() {
      console.log('Health Connect setup started');
      const initialized = await initializeHealthConnect();
      console.log('Health Connect initialized:', initialized);
      if (initialized) {
        const permissions = await requestPermissions();
        console.log('Health permissions:', permissions);
      }
    }
    setupHealthConnect();
  }, []);
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <DashboardHeader />
        <StepsProgressCard />
        <ActivitySummary />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
});

export default DashboardScreen;
