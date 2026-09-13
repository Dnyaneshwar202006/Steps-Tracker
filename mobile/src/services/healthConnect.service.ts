import { initialize, requestPermission } from "react-native-health-connect";

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