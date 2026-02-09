import { create } from 'zustand';
import { Task, KanbanState, Column } from '../types/kanban';
import { v4 as uuidv4 } from 'uuid';

const initialColumns: Record<string, Column> = {
  ready: {
    id: 'ready',
    title: 'Ready',
    tasks: [
      {
        id: uuidv4(),
        title: 'Implement Drag and Drop',
        description: 'Add drag and drop functionality to Kanban cards.',
        status: 'ready',
        order: 1,
      },
      {
        id: uuidv4(),
        title: 'Refactor State Management',
        description: 'Improve the state management for better performance.',
        status: 'ready',
        order: 2,
      },
    ],
  },
  in_progress: {
    id: 'in_progress',
    title: 'In Progress',
    tasks: [
      {
        id: uuidv4(),
        title: 'Set up CI/CD Pipeline',
        description: 'Configure the continuous integration and deployment pipeline.',
        status: 'in_progress',
        order: 1,
      },
    ],
  },
  in_review: {
    id: 'in_review',
    title: 'In Review',
    tasks: [],
  },
  done: {
    id: 'done',
    title: 'Done',
    tasks: [
      {
        id: uuidv4(),
        title: 'Initial Project Setup',
        description: 'Set up the basic project structure and dependencies.',
        status: 'done',
        order: 1,
      },
    ],
  },
};

export const useKanbanStore = create<KanbanState>((set, get) => ({
  columns: initialColumns,

  addTask: (task: Omit<Task, 'id' | 'order'>, columnId: string) =>
    set((state) => {
      const newTask: Task = {
        ...task,
        id: uuidv4(),
        order: state.columns[columnId].tasks.length + 1,
        status: columnId as 'ready' | 'in_progress' | 'in_review' | 'done',
      };
      const newColumns = { ...state.columns };
      newColumns[columnId].tasks.push(newTask);
      return { columns: newColumns };
    }),

  updateTaskStatus: (taskId: string, newStatus: Task['status']) =>
    set((state) => {
      const newColumns = JSON.parse(JSON.stringify(state.columns)); // Deep copy
      let taskToMove: Task | null = null;
      let sourceColumnId: string | null = null;

      // Find the task and its source column
      for (const columnId in newColumns) {
        const taskIndex = newColumns[columnId].tasks.findIndex((t: Task) => t.id === taskId);
        if (taskIndex !== -1) {
          taskToMove = newColumns[columnId].tasks[taskIndex];
          sourceColumnId = columnId;
          break;
        }
      }

      if (!taskToMove || !sourceColumnId) {
        return state; // Task not found
      }

      // Remove task from source column
      newColumns[sourceColumnId].tasks = newColumns[sourceColumnId].tasks.filter((t: Task) => t.id !== taskId);

      // Add task to destination column and update its status and order
      taskToMove.status = newStatus;
      taskToMove.order = newColumns[newStatus].tasks.length + 1;
      newColumns[newStatus].tasks.push(taskToMove);

      // Reorder tasks in the source column to maintain order
      newColumns[sourceColumnId].tasks.forEach((task: Task, index: number) => {
        task.order = index + 1;
      });

      // Reorder tasks in the destination column
      newColumns[newStatus].tasks.forEach((task: Task, index: number) => {
        task.order = index + 1;
      });

      return { columns: newColumns };
    }),

  moveTask: (taskId: string, sourceColumnId: string, destinationColumnId: string, destinationIndex: number) =>
    set((state) => {
      const newColumns = JSON.parse(JSON.stringify(state.columns)); // Deep copy
      const taskIndex = newColumns[sourceColumnId].tasks.findIndex((t: Task) => t.id === taskId);

      if (taskIndex === -1) {
        return state; // Task not found
      }

      const [taskToMove] = newColumns[sourceColumnId].tasks.splice(taskIndex, 1);
      taskToMove.status = destinationColumnId as Task['status'];

      // Insert task into the destination column at the specified index
      newColumns[destinationColumnId].tasks.splice(destinationIndex, 0, taskToMove);

      // Reorder tasks in the source column
      newColumns[sourceColumnId].tasks.forEach((task: Task, index: number) => {
        task.order = index + 1;
      });

      // Reorder tasks in the destination column
      newColumns[destinationColumnId].tasks.forEach((task: Task, index: number) => {
        task.order = index + 1;
      });

      return { columns: newColumns };
    }),

  reorderTasksInColumn: (columnId: string, startIndex: number, endIndex: number) =>
    set((state) => {
      const newColumns = JSON.parse(JSON.stringify(state.columns)); // Deep copy
      const tasks = Array.from(newColumns[columnId].tasks);
      const [movedTask] = tasks.splice(startIndex, 1);
      tasks.splice(endIndex, 0, movedTask);

      tasks.forEach((task: Task, index: number) => {
        task.order = index + 1;
      });

      newColumns[columnId].tasks = tasks;
      return { columns: newColumns };
    }),

  resetBoard: () => set({ columns: initialColumns }),
}));
