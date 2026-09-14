import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PlatformPressable } from '@react-navigation/elements';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import HistoryScreen from '../screens/History/HistoryScreen';
import StatisticsScreen from '../screens/Statistics/StatisticsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

import {
  DashboardIcon,
  HistoryIcon,
  StatisticsIcon,
  ProfileIcon,
} from './TabBarIcon';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_BAR = {
  height: 64,
  horizontalMargin: 35,
  bottomMargin: 35,
  radius: 32,
  iconFrame: 46,
  background: '#FFFFFF',
  activeBackground: '#111827',
  activeIcon: '#FFFFFF',
  inactiveIcon: '#9CA3AF',
};

type TabIconProps = {
  focused: boolean;
  color: string;
  size: number;
  Icon: React.ComponentType<{
    color: string;
    size: number;
  }>;
};

function TabIcon({ focused, color, size, Icon }: TabIconProps) {
  return (
    <View style={[styles.iconFrame, focused && styles.activeIconFrame]}>
      <Icon color={color} size={size} />
    </View>
  );
}

function DashboardTabIcon(props: {
  focused: boolean;
  color: string;
  size: number;
}) {
  return <TabIcon {...props} Icon={DashboardIcon} />;
}

function HistoryTabIcon(props: {
  focused: boolean;
  color: string;
  size: number;
}) {
  return <TabIcon {...props} Icon={HistoryIcon} />;
}

function StatisticsTabIcon(props: {
  focused: boolean;
  color: string;
  size: number;
}) {
  return <TabIcon {...props} Icon={StatisticsIcon} />;
}

function ProfileTabIcon(props: {
  focused: boolean;
  color: string;
  size: number;
}) {
  return <TabIcon {...props} Icon={ProfileIcon} />;
}

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: TAB_BAR.activeIcon,
        tabBarInactiveTintColor: TAB_BAR.inactiveIcon,
        tabBarButton: props => (
          <PlatformPressable
            {...props}
            android_ripple={{ color: 'transparent' }}
            pressOpacity={1}
          />
        ),
        tabBarStyle: {
          position: 'absolute',
          height: TAB_BAR.height,
          marginHorizontal: TAB_BAR.horizontalMargin,
          bottom: Math.max(insets.bottom, TAB_BAR.bottomMargin),
          borderRadius: TAB_BAR.radius,
          backgroundColor: TAB_BAR.background,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          height: TAB_BAR.height,
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarIconStyle: {
          width: TAB_BAR.iconFrame,
          height: TAB_BAR.iconFrame,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: DashboardTabIcon,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: HistoryTabIcon,
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarIcon: StatisticsTabIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ProfileTabIcon,
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconFrame: {
    width: TAB_BAR.iconFrame,
    height: TAB_BAR.iconFrame,
    borderRadius: TAB_BAR.iconFrame / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconFrame: {
    backgroundColor: TAB_BAR.activeBackground,
  },
});

export default RootNavigator;
