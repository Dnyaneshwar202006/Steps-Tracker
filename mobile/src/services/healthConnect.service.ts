import { initialize, readRecords, requestPermission } from "react-native-health-connect";

export async function initializeHealthConnect(){
    const isInitialized = await initialize();

    return isInitialized;
}

export async function requestPermissions() {
    const permissions = await requestPermission([{
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
    }
    ])

    return permissions;
}

export async function getStepsOfToday(){
    const res = await readRecords('Steps',{
        timeRangeFilter: {
            operator: 'between',
            startTime: new Date(new Date().setHours(0,0,0,0)).toISOString(),
            endTime: new Date().toISOString(),
        },
    });

    console.log(res);

    const totalSteps = res.records.reduce(( total, record )=> total + record.count , 0);
    console.log(totalSteps)
    return totalSteps;
}

export async function getCaloriesBurntToday(){
    const res = await readRecords('ActiveCaloriesBurned',{
        timeRangeFilter: {
            operator: 'between',
            startTime: new Date(new Date().setHours(0,0,0,0)).toISOString(),
            endTime: new Date().toISOString(),
        },
    });
    console.log(res);

    const caloriesBurnt = res.records.reduce(( total, record )=> total + record.energy.inKilocalories , 0);
    return Math.round(caloriesBurnt);
}

export async function getKilometersCoveredToday(){
    const res = await readRecords('Distance',{
        timeRangeFilter: {
            operator: 'between',
            startTime: new Date(new Date().setHours(0,0,0,0)).toISOString(),
            endTime: new Date().toISOString(),
        },
    });
    console.log(res);

    const distCovered = res.records.reduce(( total, record )=> total + record.distance.inKilometers, 0);
    return Number(distCovered.toFixed(2));
}