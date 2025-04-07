
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  location?: string;
  createdAt: string;
  userId: string;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

// Get tasks from localStorage
const storedTasks = localStorage.getItem('tasks');
const initialState: TaskState = {
  tasks: storedTasks ? JSON.parse(storedTasks) : [],
  isLoading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
      // Update localStorage
      localStorage.setItem('tasks', JSON.stringify(action.payload));
    },
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
      // Update localStorage
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    removeTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      // Update localStorage
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    toggleTaskCompletion(state, action: PayloadAction<string>) {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        // Update localStorage
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    updateTaskPriority(state, action: PayloadAction<{ id: string; priority: Priority }>) {
      const task = state.tasks.find(task => task.id === action.payload.id);
      if (task) {
        task.priority = action.payload.priority;
        // Update localStorage
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
  },
});

export const {
  setTasks,
  addTask,
  removeTask,
  toggleTaskCompletion,
  updateTaskPriority,
} = taskSlice.actions;

export default taskSlice.reducer;
