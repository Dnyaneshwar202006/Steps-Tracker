import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashboardHeader from './components/DashBoardHeader';
import StepsProgressCard from './components/StepsProgressCard';
import ActivitySummary from './components/ActivitySummary';
import {
  getCaloriesBurntToday,
  getKilometersCoveredToday,
  getStepsOfToday,
  initializeHealthConnect,
  requestPermissions,
} from '../../services/healthConnect.service';
import { useEffect, useState } from 'react';

function DashboardScreen() {
  const [todaySteps, setTodaySteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [dist, setDist] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  //Load the data
  async function loadDashboardData(){
    const steps = await getStepsOfToday();
    const cals = await getCaloriesBurntToday();
    const distance = await getKilometersCoveredToday();
      console.log("Todays steps: ", steps);
      console.log("Calories Today: ", cals);
      console.log("Kilometers Today: ", distance);
      setTodaySteps(steps);
      setCalories(cals);
      setDist(distance);
  }

  //Refresh Function
  async function handleRefreshing(){
    setRefreshing(true);
    try{
      await loadDashboardData();
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
        await loadDashboardData();
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
        <ActivitySummary calories={calories} kilometers={dist}/>
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
