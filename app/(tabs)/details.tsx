import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Details() {
  const params = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{params.todo}</Text>
      <Text style={styles.text}>📅 Дата: {params.date}</Text>
      <Text style={styles.text}>⚡ Пріоритет: {params.priority}</Text>
      <Text style={styles.text}>
        {params.completed === 'true' ? '✅ Виконано' : '⏳ В процесі'}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F0F2F5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1A1A1A' },
  text: { fontSize: 18, marginBottom: 10, color: '#333' },
});