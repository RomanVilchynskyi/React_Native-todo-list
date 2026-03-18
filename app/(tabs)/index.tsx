import React, { useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTodos } from '../context/TODOContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Todo {
  id: number;
  todo: string;
  date: string;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  notificationId?: string;
}

export default function Index() {
  const { todos, toggleTodo, deleteTodo } = useTodos(); // ← додали toggleTodo, deleteTodo
  const router = useRouter();
  const lastTap = useRef<{ [key: number]: number }>({});
  const insets = useSafeAreaInsets();

  // подвійний клік → toggle статусу
  const handleDoubleTap = (id: number) => {
    const now = Date.now();
    if (now - (lastTap.current[id] || 0) < 300) {
      toggleTodo(id);
    }
    lastTap.current[id] = now;
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <TouchableOpacity
      onPress={() => {
        handleDoubleTap(item.id);
        router.push({
          pathname: '/details' as any,
          params: {
            todo: item.todo,
            date: item.date,
            priority: item.priority,
            completed: item.completed.toString(),
            deadline: item.deadline.toString(),
          },
        });
      }}
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
            {/* ← показуємо дедлайн якщо є */}
            {item.deadline && (
              <Text style={styles.deadline}>
                ⏰ {new Date(item.deadline).toLocaleString('uk-UA')}
              </Text>
            )}
          </View>

          <View style={styles.actions}>
            <Text style={styles.statusIcon}>{item.completed ? '✅' : '⏳'}</Text>
            {/* ← кнопка видалення */}
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Text style={styles.deleteIcon}>🗑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.header}>My To-Do List</Text>
        }
      />
    </View>
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
  deadline: { fontSize: 12, color: '#E67E22', marginTop: 4 }, // ← новий стиль
  completed: { textDecorationLine: 'line-through', color: '#BBB' },
  statusIcon: { fontSize: 22 },
  actions: { alignItems: 'center', gap: 8 },                  // ← новий стиль
  deleteIcon: { fontSize: 22 },                               // ← новий стиль
});
