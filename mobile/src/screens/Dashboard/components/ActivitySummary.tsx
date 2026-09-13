import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function ActivitySummary({ calories, kilometers, mins }: { calories: number, kilometers: number, mins: number }) {
    const activities = [
        {value: calories, label: 'Calories'},
        {value: kilometers, label: 'Kilometers'},
        {value: mins, label: 'Minutes'},
    ]
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Activity</Text>
      <View style={styles.row}>
        {activities.map((activity, idx)=>(
            <React.Fragment key={activity.label}>
                <View style={styles.item}>
                    <Text style={styles.value}>{activity.value}</Text>
                    <Text style={styles.label}>{activity.label}</Text>
                </View>
                {idx< activities.length - 1 && (
                    <View style={styles.divider} />
                )}
            </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: '#E5E7EB',
  },
});

export default ActivitySummary;
