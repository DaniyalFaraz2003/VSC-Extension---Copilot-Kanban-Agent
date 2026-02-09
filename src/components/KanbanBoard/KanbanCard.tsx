import React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { Task } from '../../types/kanban';

interface KanbanCardProps {
  task: Task;
  innerRef?: (element: HTMLElement | null) => void;
  draggableProps?: DraggableProvided['draggableProps'];
  dragHandleProps?: DraggableProvided['dragHandleProps'];
}

const KanbanCard: React.FC<KanbanCardProps> = React.forwardRef(
  ({ task, innerRef, draggableProps, dragHandleProps }, ref) => {
    return (
      <div
        ref={innerRef}
        {...draggableProps}
        {...dragHandleProps}
        className="kanban-card"
      >
        <h3>{task.title}</h3>
        <p>{task.description}</p>
      </div>
    );
  }
);

export default KanbanCard;
