import { StyleSheet, Text, View } from 'react-native';
import ProgressRing from './ProgressRing';

function StepsProgressCard() {
  const steps = 8420;
  const goal = 10000;
  const progress = Math.min(steps / goal , 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Steps</Text>
      <View style={styles.ringContainer}>
        <ProgressRing
        progress={progress}
        size={200}
        strokeWidth={14} />
        <View style={styles.placeholder}>
          <Text style={styles.steps}>{steps.toLocaleString()}</Text>
          <Text style={styles.goal}>{goal.toLocaleString()}</Text>
        </View>
      </View>
      <Text style={styles.percentage}>
        {Math.round(progress * 100)}% of your daily goal
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  ringContainer: {
    width: 200,
    height: 200,
    marginVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    position: 'absolute',
    alignItems: 'center',
  },
  steps: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  goal: {
    marginTop: 4,
    fontSize: 14,
    color: '#9CA3AF',
  },
  percentage: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default StepsProgressCard;