import React, { createContext, useContext, useState } from 'react';

interface Todo {
  id: number;
  todo: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
}

const TodoContext = createContext<TodoContextType>({
  todos: [],
  addTodo: () => {},
});

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, todo: 'Купити продукти', date: '2024-05-20', priority: 'high', completed: false },
    { id: 2, todo: 'Зробити зарядку', date: '2024-05-21', priority: 'medium', completed: true },
  ]);

  const addTodo = (todo: Todo) => {
    setTodos(prev => [todo, ...prev]);
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

export const useTodos = () => useContext(TodoContext);