import {
  initialize,
  readRecords,
  requestPermission,
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
  const res = await readRecords('Steps', {
    timeRangeFilter: {
      operator: 'between',
      startTime: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      endTime: new Date().toISOString(),
    },
  });

  const totalSteps = res.records.reduce(
    (total, record) => total + record.count,
    0,
  );
  console.log(totalSteps);
  return totalSteps;
}

export async function getCaloriesBurntToday() {
  const res = await readRecords('ActiveCaloriesBurned', {
    timeRangeFilter: {
      operator: 'between',
      startTime: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      endTime: new Date().toISOString(),
    },
  });

  const caloriesBurnt = res.records.reduce(
    (total, record) => total + record.energy.inKilocalories,
    0,
  );
  return Math.round(caloriesBurnt);
}

export async function getKilometersCoveredToday() {
  const res = await readRecords('Distance', {
    timeRangeFilter: {
      operator: 'between',
      startTime: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      endTime: new Date().toISOString(),
    },
  });

  const distCovered = res.records.reduce(
    (total, record) => total + record.distance.inKilometers,
    0,
  );
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

export async function getHistory(){
    const endTime = new Date();
    const startTime = new Date();

    startTime.setDate(startTime.getDate() - 19);
    startTime.setHours(0, 0, 0, 0);
    const res = readRecords('Steps',{
        timeRangeFilter: {
            operator: 'between',
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
        },
    });
    const dailySteps: Record<string, number> = {};
    (await res).records.forEach((record)=> {
        const date = new Date(record.startTime).toDateString(); 
        if(!dailySteps[date]){
            dailySteps[date] = 0;
        }
        dailySteps[date] += record.count;
    });
    return dailySteps;
}
