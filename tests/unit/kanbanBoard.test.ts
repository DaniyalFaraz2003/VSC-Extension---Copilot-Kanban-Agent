import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import KanbanBoard from '../src/components/KanbanBoard'; // Adjust path as necessary
import { Task, TaskStatus } from '../src/types';

describe('KanbanBoard Drag and Drop', () => {
    const mockTasks: Task[] = [
        { id: 'task-1', title: 'Task 1', status: 'ready', order: 1, createdBy: 'agent' },
        { id: 'task-2', title: 'Task 2', status: 'in_progress', order: 1, createdBy: 'agent' },
        { id: 'task-3', title: 'Task 3', status: 'done', order: 1, createdBy: 'agent' },
    ];

    it('should allow dragging a task from one column to another and update status', () => {
        const mockOnTaskMove = jest.fn();
        render(<KanbanBoard tasks={mockTasks} onTaskMove={mockOnTaskMove} />);

        // Find the task to drag (e.g., 'Task 1' in 'Ready' column)
        const taskToDrag = screen.getByText('Task 1');
        expect(taskToDrag).toBeInTheDocument();

        // Simulate drag start on 'Task 1'
        // We need to find the parent draggable element which is the .task div
        const draggableTask = taskToDrag.closest('.task');
        expect(draggableTask).toBeInTheDocument();

        // Mock dataTransfer for drag events
        const dataTransfer = {
            setData: jest.fn(),
            getData: jest.fn(),
            effectAllowed: 'move',
            dropEffect: 'move'
        };
        fireEvent.dragStart(draggableTask!, {
            dataTransfer
        });
        expect(dataTransfer.setData).toHaveBeenCalledWith('text/plain', 'task-1');

        // Find the target column (e.g., 'In Progress')
        // We need to find the .task-list element that corresponds to 'In Progress'
        // This might require a more specific selector or finding the parent column header
        const inProgressColumn = screen.getByText('In Progress').closest('.column')?.querySelector('.task-list');
        expect(inProgressColumn).toBeInTheDocument();

        // Simulate drag over the target column
        fireEvent.dragOver(inProgressColumn!, {
            dataTransfer,
            preventDefault: jest.fn()
        });

        // Simulate drop on the target column
        fireEvent.drop(inProgressColumn!, {
            dataTransfer: {
                ...dataTransfer,
                getData: () => 'task-1' // Ensure getData returns the correct ID
            },
            preventDefault: jest.fn()
        });

        // Check if onTaskMove was called with the correct arguments
        expect(mockOnTaskMove).toHaveBeenCalledWith('task-1', 'in_progress');
    });

    it('should display "No tasks here" when a column is empty', () => {
        const emptyTasks: Task[] = [
            { id: 'task-1', title: 'Task 1', status: 'ready', order: 1, createdBy: 'agent' },
        ];
        render(<KanbanBoard tasks={emptyTasks} onTaskMove={jest.fn()} />);

        // Check if 'No tasks here' is visible in the 'In Progress' column
        const inProgressColumn = screen.getByText('In Progress').closest('.column')?.querySelector('.task-list');
        expect(inProgressColumn).toHaveTextContent('No tasks here');
    });
});
