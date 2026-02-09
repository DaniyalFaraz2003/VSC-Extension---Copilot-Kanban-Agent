"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom");
describe('KanbanBoard Drag and Drop', () => {
    const mockTasks = [
        { id: 'task-1', title: 'Task 1', status: 'ready', order: 1, createdBy: 'agent' },
        { id: 'task-2', title: 'Task 2', status: 'in_progress', order: 1, createdBy: 'agent' },
        { id: 'task-3', title: 'Task 3', status: 'done', order: 1, createdBy: 'agent' },
    ];
    it('should allow dragging a task from one column to another and update status', () => {
        const mockOnTaskMove = jest.fn();
        (0, react_1.render)(tasks, { mockTasks }, onTaskMove = { mockOnTaskMove } /  > );
        // Find the task to drag (e.g., 'Task 1' in 'Ready' column)
        const taskToDrag = react_1.screen.getByText('Task 1');
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
        react_1.fireEvent.dragStart(draggableTask, {
            dataTransfer
        });
        expect(dataTransfer.setData).toHaveBeenCalledWith('text/plain', 'task-1');
        // Find the target column (e.g., 'In Progress')
        // We need to find the .task-list element that corresponds to 'In Progress'
        // This might require a more specific selector or finding the parent column header
        const inProgressColumn = react_1.screen.getByText('In Progress').closest('.column')?.querySelector('.task-list');
        expect(inProgressColumn).toBeInTheDocument();
        // Simulate drag over the target column
        react_1.fireEvent.dragOver(inProgressColumn, {
            dataTransfer,
            preventDefault: jest.fn()
        });
        // Simulate drop on the target column
        react_1.fireEvent.drop(inProgressColumn, {
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
        const emptyTasks = [
            { id: 'task-1', title: 'Task 1', status: 'ready', order: 1, createdBy: 'agent' },
        ];
        (0, react_1.render)(tasks, { emptyTasks }, onTaskMove = { jest, : .fn() } /  > );
        // Check if 'No tasks here' is visible in the 'In Progress' column
        const inProgressColumn = react_1.screen.getByText('In Progress').closest('.column')?.querySelector('.task-list');
        expect(inProgressColumn).toHaveTextContent('No tasks here');
    });
});
//# sourceMappingURL=kanbanBoard.test.js.map