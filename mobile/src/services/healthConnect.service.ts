import {
  initialize,
  readRecords,
  requestPermission,
  aggregateRecord,
} from 'react-native-health-connect';

export async function initializeHealthConnect() {
  const isInitialized = await initialize();

  return isInitialized;
}

export async function requestPermissions() {
  const permissions = await requestPermission([
    {
      accessType: 'read',
      recordType: 'Steps',
    },
    {
      accessType: 'read',
      recordType: 'ActiveCaloriesBurned',
    },
    {
      accessType: 'read',
      recordType: 'Distance',
    },
    {
      accessType: 'read',
      recordType: 'ExerciseSession',
    },
  ]);

  return permissions;
}

export async function getStepsOfToday() {
  const endTime = new Date();
  const startTime = new Date(endTime);
  startTime.setHours(0, 0, 0, 0);

  const res = await aggregateRecord({
    recordType: 'Steps',
    timeRangeFilter: {
      operator: 'between',
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    },
  });

  const totalSteps = res.COUNT_TOTAL ?? 0;
  console.log('TODAY STEPS:', totalSteps);
  return totalSteps;
}

export async function getCaloriesBurntToday() {
  const res = await aggregateRecord({
    recordType: 'ActiveCaloriesBurned',
    timeRangeFilter: {
      operator: 'between',
      startTime: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      endTime: new Date().toISOString(),
    },
  });

  const caloriesBurnt = res.ACTIVE_CALORIES_TOTAL.inKilocalories ?? 0;
  return Math.round(caloriesBurnt);
}

export async function getKilometersCoveredToday() {
  const res = await aggregateRecord({
    recordType: 'Distance',
    timeRangeFilter: {
      operator: 'between',
      startTime: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      endTime: new Date().toISOString(),
    },
  });

  const distCovered = res.DISTANCE.inKilometers ?? 0;
  return Number(distCovered.toFixed(2));
}

export async function getMinutes() {
  const res = await readRecords('ExerciseSession', {
    timeRangeFilter: {
      operator: 'between',
      startTime: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      endTime: new Date().toISOString(),
    },
  });

  const minutes = res.records.reduce((total, record) => {
    const start = new Date(record.startTime).getTime();
    const end = new Date(record.endTime).getTime();

    return total + (end - start) / (1000 * 60);
  }, 0);

  return Math.round(minutes);
}
