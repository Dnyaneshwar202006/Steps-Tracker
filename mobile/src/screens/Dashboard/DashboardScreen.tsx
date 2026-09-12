import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const DashboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Steps Tracker</Text>
      <Text style={styles.subtitle}>DashboardScreen</Text>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
  },
});
