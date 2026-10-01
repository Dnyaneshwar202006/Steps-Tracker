import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/auth.service';

interface ProfileScreenProps {
  setIsAuthenticated?: (value: boolean) => void;
}

function ProfileScreen({ setIsAuthenticated: propSetIsAuthenticated }: ProfileScreenProps) {
  const { logout, setIsAuthenticated: contextSetIsAuthenticated } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [goal, setGoal] = useState<number>(10000);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
      const goals = await AsyncStorage.getItem('goal');
      if (goals) {
        setGoal(JSON.parse(goals));
      }
    } catch (error) {
      console.error('Error occurred loading user: ', error);
    }
  };

  const performLogout = async () => {
    try {
      setIsLoggingOut(true);
      if (logout) {
        await logout();
      } else {
        await logoutUser();
        const setAuth = propSetIsAuthenticated || contextSetIsAuthenticated;
        if (setAuth) {
          setAuth(false);
        }
      }
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert(
        'Logout Error',
        'Could not complete server logout, but session data was cleared locally.',
      );
      const setAuth = propSetIsAuthenticated || contextSetIsAuthenticated;
      if (setAuth) {
        setAuth(false);
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutPress = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of StepsTracker?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: performLogout,
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.badge}>Steps Tracker User</Text>
          <Text style={styles.email}>{user?.email || 'No email registered'}</Text>
        </View>

        <View style={styles.goalCard}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="target" size={22} color="#111827" />
            <Text style={styles.cardTitle}>Daily Goal</Text>
          </View>
          <Text style={styles.goal}>{goal.toLocaleString()} steps</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account</Text>

          <TouchableOpacity
            style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
            onPress={handleLogoutPress}
            disabled={isLoggingOut}
            activeOpacity={0.7}
          >
            {isLoggingOut ? (
              <View style={styles.logoutContent}>
                <ActivityIndicator size="small" color="#EF4444" />
                <Text style={styles.logoutText}>Logging out...</Text>
              </View>
            ) : (
              <View style={styles.logoutContent}>
                <MaterialCommunityIcons
                  name="logout-variant"
                  size={22}
                  color="#EF4444"
                />
                <Text style={styles.logoutText}>Log Out</Text>
              </View>
            )}
            {!isLoggingOut && (
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="#F87171"
              />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>StepsTracker v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 130, // Clearance for floating bottom tab bar
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginTop: 14,
  },
  badge: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  goal: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginTop: 10,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 32,
  },
});

export default ProfileScreen;
