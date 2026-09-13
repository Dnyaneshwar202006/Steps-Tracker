import { initialize, readRecords, requestPermission } from "react-native-health-connect";

export async function initializeHealthConnect(){
    const isInitialized = await initialize();

    return isInitialized;
}

export async function requestPermissions() {
    const permissions = await requestPermission([{
        accessType: 'read',
        recordType: 'Steps',
    }])

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