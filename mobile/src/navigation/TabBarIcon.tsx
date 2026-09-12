import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
interface TabBarIconProps {
  color: string;
  size: number;
}
export function DashboardIcon({ color, size }: TabBarIconProps) {
  return (
    <MaterialCommunityIcons name="home-outline" color={color} size={size} />
  );
}
export function HistoryIcon({ color, size }: TabBarIconProps) {
  return <MaterialCommunityIcons name="history" color={color} size={size} />;
}
export function StatisticsIcon({ color, size }: TabBarIconProps) {
  return <MaterialCommunityIcons name="chart-bar" color={color} size={size} />;
}
export function ProfileIcon({ color, size }: TabBarIconProps) {
  return (
    <MaterialCommunityIcons name="account-outline" color={color} size={size} />
  );
}
