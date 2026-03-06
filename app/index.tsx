import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';

// Типізація
interface Todo {
  id: number;
  todo: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface FormData {
  todo: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      todo: '',
      date: new Date().toISOString().split('T')[0], // Сьогоднішня дата за замовчуванням
      priority: 'low',
    },
  });

  // Завантаження початкових даних
  useEffect(() => {
    fetch('https://dummyjson.com/todos?limit=5')
      .then(res => res.json())
      .then((data) => {
        const initialTodos = data.todos.map((item: any) => ({
          id: item.id,
          todo: item.todo,
          completed: item.completed,
          date: '2024-05-20',
          priority: 'medium' as const,
        }));
        setTodos(initialTodos);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Додавання нового завдання
  const onSubmit = (data: FormData) => {
    const newTodo: Todo = {
      id: Date.now(), // Унікальний ID через час
      todo: data.todo,
      date: data.date || 'No date',
      priority: data.priority,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
    reset(); // Очищуємо поля після додавання
  };

  // Перемикання статусу
  const toggleTodoStatus = (id: number) => {
    setTodos(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <TouchableOpacity onPress={() => toggleTodoStatus(item.id)} activeOpacity={0.7}>
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

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text>Завантаження...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <FlatList
          data={todos}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.headerSection}>
              <Text style={styles.header}>My To-Do List</Text>
              <View style={styles.formCard}>
                
                <Text style={styles.label}>Назва завдання:</Text>
                <Controller
                  control={control}
                  name="todo"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Що потрібно зробити?"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />

                <Text style={styles.label}>Дата:</Text>
                <Controller
                  control={control}
                  name="date"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-MM-DD"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />

                <Text style={styles.label}>Пріоритет:</Text>
                <View style={styles.pickerWrapper}>
                  <Controller
                    control={control}
                    name="priority"
                    render={({ field: { onChange, value } }) => (
                      <Picker
                        selectedValue={value}
                        onValueChange={onChange}
                        style={Platform.OS === 'android' ? { height: 50 } : {}}
                      >
                        <Picker.Item label="Низький" value="low" />
                        <Picker.Item label="Середній" value="medium" />
                        <Picker.Item label="Високий" value="high" />
                      </Picker>
                    )}
                  />
                </View>

                <TouchableOpacity 
                  style={styles.addButton} 
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text style={styles.addButtonText}>Додати завдання</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.subHeader}>Ваші справи:</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  headerSection: { paddingTop: 20 },
  header: { fontSize: 32, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 20, textAlign: 'center' },
  subHeader: { fontSize: 18, fontWeight: 'bold', color: '#444', marginVertical: 15 },
  formCard: { 
    backgroundColor: '#FFF', 
    padding: 20, 
    borderRadius: 15, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8 
  },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 5 },
  input: { 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    backgroundColor: '#F9F9F9',
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 15,
    fontSize: 16
  },
  pickerWrapper: { 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 8, 
    backgroundColor: '#F9F9F9', 
    marginBottom: 20,
    justifyContent: 'center'
  },
  addButton: { 
    backgroundColor: '#4A90E2', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  addButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  card: { 
    backgroundColor: '#FFF', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12, 
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '500', color: '#333' },
  details: { fontSize: 13, color: '#888', marginTop: 4 },
  completed: { textDecorationLine: 'line-through', color: '#BBB' },
  statusIcon: { fontSize: 22 },
});