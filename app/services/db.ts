import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('todos.db');

// створення таблиці при старті
export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY NOT NULL,
      todo TEXT NOT NULL,
      date TEXT NOT NULL,
      deadline TEXT,
      priority TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      notificationId TEXT
    );
  `);
};

// отримати всі завдання
export const getTodos = () => {
  return db.getAllSync('SELECT * FROM todos ORDER BY id DESC;');
};

// додати завдання
export const insertTodo = (todo: {
  id: number;
  todo: string;
  date: string;
  deadline: string;
  priority: string;
  completed: boolean;
  notificationId?: string;
}) => {
  db.runSync(
    `INSERT INTO todos (id, todo, date, deadline, priority, completed, notificationId)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [
      todo.id,
      todo.todo,
      todo.date,
      todo.deadline,
      todo.priority,
      todo.completed ? 1 : 0,
      todo.notificationId ?? null,
    ]
  );
};

// оновити статус завдання
export const updateTodoCompleted = (id: number, completed: boolean) => {
  db.runSync(
    'UPDATE todos SET completed = ? WHERE id = ?;',
    [completed ? 1 : 0, id]
  );
};

// видалити завдання
export const deleteTodoById = (id: number) => {
  db.runSync('DELETE FROM todos WHERE id = ?;', [id]);
};