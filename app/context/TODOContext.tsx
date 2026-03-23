import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useDispatch } from 'react-redux';
import { setUncompletedCount } from '../slices/menuSlice';
import {
  initDB,
  getTodos,
  insertTodo,
  updateTodoCompleted,
  deleteTodoById,
} from '../services/db';

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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const dispatch = useDispatch();

  // ініціалізація БД та завантаження даних
  useEffect(() => {
    initDB(); // створює таблицю якщо не існує

    const rows = getTodos() as any[];
    const loaded: Todo[] = rows.map(row => ({
      id: row.id,
      todo: row.todo,
      date: row.date,
      deadline: new Date(row.deadline),
      priority: row.priority,
      completed: row.completed === 1, // SQLite зберігає 0/1
      notificationId: row.notificationId ?? undefined,
    }));
    setTodos(loaded);
  }, []);

  // оновлення бейджика при зміні todos
  useEffect(() => {
    const count = todos.filter(t => !t.completed).length;
    dispatch(setUncompletedCount(count));
  }, [todos]);

  // дозвіл на нотифікації
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  // реєстрація кнопок нотифікації
  useEffect(() => {
    Notifications.setNotificationCategoryAsync('todo_actions', [
      { identifier: 'complete', buttonTitle: '✅ Complete', options: { isDestructive: false } },
      { identifier: 'delete', buttonTitle: '🗑 Delete', options: { isDestructive: true } },
    ]);

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const todoId = response.notification.request.content.data.todoId as number;
      const action = response.actionIdentifier;
      if (action === 'complete') toggleTodo(todoId);
      else if (action === 'delete') deleteTodo(todoId);
    });

    return () => subscription.remove();
  }, []);

  const scheduleNotification = async (todo: Todo): Promise<string> => {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Дедлайн!',
        body: `Завдання "${todo.todo}" потрібно виконати!`,
        data: { todoId: todo.id },
        categoryIdentifier: 'todo_actions',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(todo.deadline),
      },
    });
    return notificationId;
  };

  const addTodo = async (todo: Todo) => {
    const notificationId = await scheduleNotification(todo);
    const newTodo = { ...todo, notificationId };

    // зберігаємо в SQLite
    insertTodo({
      ...newTodo,
      deadline: newTodo.deadline.toISOString(),
    });

    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id: number) => {
    setTodos(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, completed: !item.completed };
          updateTodoCompleted(id, updated.completed); // ← оновлюємо в SQLite
          return updated;
        }
        return item;
      })
    );
  };

  const deleteTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (todo?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(todo.notificationId);
    }
    deleteTodoById(id); // ← видаляємо з SQLite
    setTodos(prev => prev.filter(item => item.id !== id));
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

export const useTodos = () => useContext(TodoContext);
