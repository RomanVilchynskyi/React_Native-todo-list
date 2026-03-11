import React from 'react';
import {
  View, Text, TextInput, StyleSheet,
  SafeAreaView, TouchableOpacity, Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import { useTodos } from '../context/TODOContext';

interface FormData {
  todo: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export default function Create() {
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      todo: '',
      date: new Date().toISOString().split('T')[0],
      priority: 'low',
    },
  });

const { addTodo } = useTodos(); // додай імпорт

const onSubmit = (data: FormData) => {
  addTodo({
    id: Date.now(),
    todo: data.todo,
    date: data.date || 'No date',
    priority: data.priority,
    completed: false,
  });
  reset();
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.header}>Нове завдання</Text>

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

        <TouchableOpacity style={styles.addButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.addButtonText}>Додати завдання</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 20, textAlign: 'center' },
  formCard: {
    backgroundColor: '#FFF', padding: 20, borderRadius: 15, elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8,
  },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 5 },
  input: {
    borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#F9F9F9',
    padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8,
    backgroundColor: '#F9F9F9', marginBottom: 20,
  },
  addButton: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});