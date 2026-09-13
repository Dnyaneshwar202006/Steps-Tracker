import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashboardHeader from './components/DashBoardHeader';
import StepsProgressCard from './components/StepsProgressCard';
import ActivitySummary from './components/ActivitySummary';
import {
  getStepsOfToday,
  initializeHealthConnect,
  requestPermissions,
} from '../../services/healthConnect.service';
import { useEffect, useState } from 'react';

function DashboardScreen() {
  const [todaySteps, setTodaySteps] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  //Load the steps
  async function loadSteps(){
    const steps = await getStepsOfToday();
      console.log("Todays steps: ", steps);
      setTodaySteps(steps);
  }

  //Refresh Function
  async function handleRefreshing(){
    setRefreshing(true);
    try{
      await loadSteps();
    }finally{
      setRefreshing(false);
    }
  }

  useEffect(() => {
    async function setupHealthConnect() {
      console.log('Health Connect setup started');
      const initialized = await initializeHealthConnect();
      console.log('Health Connect initialized:', initialized);
      if (initialized) {
        const permissions = await requestPermissions();
        console.log('Health permissions:', permissions);
        await loadSteps();
      }
    }
    setupHealthConnect();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefreshing} />}>
        <DashboardHeader />
        <StepsProgressCard steps={todaySteps}/>
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
