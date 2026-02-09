import React from 'react';
import { Task } from '../types';

interface KanbanCardProps {
    task: Task;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
    onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task, onDragStart, onDragEnd }) => {
    return (
        <div
            className={`task ${task.status === 'in_progress' ? 'in-progress' : ''}`}
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            onDragEnd={onDragEnd}
        >
            <div className="task-title">{task.title}</div>
            <div className="task-meta">
                <span className="task-order">#{task.order}</span>
                <span className="task-agent">by Agent</span>
            </div>
        </div>
    );
};

export default KanbanCard;
