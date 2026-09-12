import { StyleSheet, Text, View } from 'react-native';

function ActivitySummary() {
  return (
    <View>
      <Text style={styles.title}>Today's Activity</Text>
      <View style={styles.card}>
        <Text style={styles.placeholder}>
          Activity summary coming next
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  placeholder: {
    color: '#6B7280',
  },
});

export default ActivitySummary;