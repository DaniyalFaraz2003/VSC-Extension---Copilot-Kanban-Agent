import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface KanbanState {
    tasks: Task[];
}

const initialState: KanbanState = {
    tasks: [],
};

export const kanbanSlice = createSlice({
    name: 'kanban',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdBy'>> & { createdBy: 'agent' }) => {
            const newTask: Task = {
                ...action.payload,
                id: uuidv4(),
            };
            state.tasks.push(newTask);
            // Sort tasks by order after adding
            state.tasks.sort((a, b) => a.order - b.order);
        },
        setTaskStatus: (state, action: PayloadAction<{ taskId: string; status: TaskStatus }>)=>{
            const { taskId, status } = action.payload;
            const taskIndex = state.tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                // Ensure only one task is in 'in_progress' state
                if (status === 'in_progress') {
                    state.tasks.forEach(task => {
                        if (task.id !== taskId) {
                            task.status = 'ready'; // Move other in_progress tasks back to ready
                        }
                    });
                }
                state.tasks[taskIndex].status = status;
            }
        },
        // New reducer to handle moving tasks between columns
        moveTask: (state, action: PayloadAction<{ taskId: string; newStatus: TaskStatus }>)=>{
            const { taskId, newStatus } = action.payload;
            const taskIndex = state.tasks.findIndex(task => task.id === taskId);

            if (taskIndex !== -1) {
                const currentStatus = state.tasks[taskIndex].status;
                const currentOrder = state.tasks[taskIndex].order;

                // If moving to the same status, do nothing for now (could implement reordering later)
                if (currentStatus === newStatus) {
                    return;
                }

                // Handle the 'in_progress' constraint
                if (newStatus === 'in_progress') {
                    // If another task is already in progress, move it back to ready
                    state.tasks.forEach(task => {
                        if (task.status === 'in_progress' && task.id !== taskId) {
                            task.status = 'ready';
                        }
                    });
                }

                // Update the task's status
                state.tasks[taskIndex].status = newStatus;

                // Re-order tasks within the new status column
                // For simplicity, we'll just append it to the end of the new column for now.
                // A more robust solution would involve reordering based on drop position.
                // We can assign a high order number to place it at the end.
                let maxOrderInNewStatus = 0;
                state.tasks.forEach(task => {
                    if (task.status === newStatus) {
                        maxOrderInNewStatus = Math.max(maxOrderInNewStatus, task.order);
                    }
                });
                state.tasks[taskIndex].order = maxOrderInNewStatus + 1;

                // Re-sort all tasks to maintain order
                state.tasks.sort((a, b) => a.order - b.order);
            }
        },
        resetBoard: (state) => {
            state.tasks = [];
        },
        setTasks: (state, action: PayloadAction<Task[]>) => {
            state.tasks = action.payload;
        }
    },
});

export const { addTask, setTaskStatus, moveTask, resetBoard, setTasks } = kanbanSlice.actions;

export default kanbanSlice.reducer;
