import { StyleSheet, Text, View } from 'react-native';

function DashboardHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>Good morning</Text>
        <Text style={styles.title}>Let's get moving!</Text>
      </View>
      <View style={styles.dateBadge}>
        <Text style={styles.date}>TODAY</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  dateBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  date: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.5,
  },
});

export default DashboardHeader;
