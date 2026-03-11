import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTodos } from '../context/TODOContext';

interface Todo {
  id: number;
  todo: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

const INITIAL_TODOS: Todo[] = [
  { id: 1, todo: 'Купити продукти', date: '2024-05-20', priority: 'high', completed: false },
  { id: 2, todo: 'Зробити зарядку', date: '2024-05-21', priority: 'medium', completed: true },
  { id: 3, todo: 'Прочитати книгу', date: '2024-05-22', priority: 'low', completed: false },
];

export default function Index() {
  const { todos } = useTodos();
  const router = useRouter();

  const renderItem = ({ item }: { item: Todo }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/(tabs)/details',
          params: {
            todo: item.todo,
            date: item.date,
            priority: item.priority,
            completed: item.completed.toString(),
          },
        })
      }
      activeOpacity={0.7}
    >
      
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, item.completed && styles.completed]}>
              {item.todo}
            </Text>
            <Text style={styles.details}>
              📅 {item.date} | ⚡ {item.priority.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.statusIcon}>{item.completed ? '✅' : '⏳'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.header}>My To-Do List</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { fontSize: 32, fontWeight: 'bold', color: '#1A1A1A', marginVertical: 20, textAlign: 'center' },
  card: {
    backgroundColor: '#FFF', padding: 16, borderRadius: 12,
    marginBottom: 12, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '500', color: '#333' },
  details: { fontSize: 13, color: '#888', marginTop: 4 },
  completed: { textDecorationLine: 'line-through', color: '#BBB' },
  statusIcon: { fontSize: 22 },
});