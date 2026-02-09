import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import './KanbanBoard.css'; // Assuming you might add some CSS for drag feedback

interface KanbanBoardProps {
    tasks: Task[];
    onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskMove }) => {
    const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
        setDraggingTaskId(taskId);
        e.dataTransfer.setData('text/plain', taskId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId && draggingTaskId === taskId) {
            onTaskMove(taskId, newStatus);
        }
        setDraggingTaskId(null);
    };

    const handleDragEnd = () => {
        setDraggingTaskId(null);
    };

    const getTasksByStatus = (status: TaskStatus) => {
        return tasks.filter(task => task.status === status);
    };

    const renderTaskList = (status: TaskStatus) => {
        const statusTasks = getTasksByStatus(status);
        return (
            <div
                className={`task-list ${draggingTaskId ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
                data-status={status}
            >
                {statusTasks.length > 0 ? (
                    statusTasks.map(task => (
                        <div
                            key={task.id}
                            className={`task ${task.status === 'in_progress' ? 'in-progress' : ''}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onDragEnd={handleDragEnd}
                        >
                            <div className="task-title">{task.title}</div>
                            <div className="task-meta">
                                <span className="task-order">#{task.order}</span>
                                <span className="task-agent">by Agent</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">No tasks here</div>
                )}
            </div>
        );
    };

    return (
        <div className="board">
            <div className="column">
                <div className="column-header">
                    <span>Ready</span>
                    <span className="column-count">{getTasksByStatus('ready').length}</span>
                </div>
                {renderTaskList('ready')}
            </div>

            <div className="column">
                <div className="column-header">
                    <span>In Progress</span>
                    <span className="column-count">{getTasksByStatus('in_progress').length}</span>
                </div>
                {renderTaskList('in_progress')}
            </div>

            <div className="column">
                <div className="column-header">
                    <span>In Review</span>
                    <span className="column-count">{getTasksByStatus('in_review').length}</span>
                </div>
                {renderTaskList('in_review')}
            </div>

            <div className="column">
                <div className="column-header">
                    <span>Done</span>
                    <span className="column-count">{getTasksByStatus('done').length}</span>
                </div>
                {renderTaskList('done')}
            </div>
        </div>
    );
};

export default KanbanBoard;
