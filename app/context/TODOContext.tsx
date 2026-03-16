import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

interface Todo {
  id: number;
  todo: string;
  date: string;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  notificationId?: string;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

const TodoContext = createContext<TodoContextType>({
  todos: [],
  addTodo: () => {},
  toggleTodo: () => {},
  deleteTodo: () => {},
});

const STORAGE_KEY = 'todos';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,  // ← додай
    shouldShowList: true,
  }),
});

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Запит дозволу на нотифікації при старті
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Дозвольте нотифікації для нагадувань про дедлайни!');
      }
    };
    requestPermissions();
  }, []);

  // Завантаження при старті
  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setTodos(JSON.parse(stored));
    };
    load();
  }, []);

  // Збереження при зміні
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // Планування нотифікації з кнопками Complete / Delete
  const scheduleNotification = async (todo: Todo): Promise<string> => {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Дедлайн!',
        body: `Завдання "${todo.todo}" потрібно виконати!`,
        data: { todoId: todo.id }, // передаємо id для обробки кнопок
        categoryIdentifier: 'todo_actions', // прив'язуємо категорію з кнопками
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(todo.deadline), // коли показати нотифікацію
      },
    });
    return notificationId;
  };

  // Реєстрація кнопок нотифікації (Complete / Delete)
  useEffect(() => {
    Notifications.setNotificationCategoryAsync('todo_actions', [
      {
        identifier: 'complete',
        buttonTitle: '✅ Complete',
        options: { isDestructive: false },
      },
      {
        identifier: 'delete',
        buttonTitle: '🗑 Delete',
        options: { isDestructive: true },
      },
    ]);

    // Слухаємо відповідь користувача на кнопки
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const todoId = response.notification.request.content.data.todoId as number;
      const action = response.actionIdentifier;

      if (action === 'complete') {
        toggleTodo(todoId);
      } else if (action === 'delete') {
        deleteTodo(todoId);
      }
    });

    return () => subscription.remove();
  }, []);

  const addTodo = async (todo: Todo) => {
    const notificationId = await scheduleNotification(todo);
    setTodos(prev => [{ ...todo, notificationId }, ...prev]);
  };

  const toggleTodo = (id: number) => {
    setTodos(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteTodo = async (id: number) => {
    // Скасовуємо нотифікацію перед видаленням
    const todo = todos.find(t => t.id === id);
    if (todo?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(todo.notificationId);
    }
    setTodos(prev => prev.filter(item => item.id !== id));
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

export const useTodos = () => useContext(TodoContext);