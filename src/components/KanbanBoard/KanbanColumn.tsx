import React from 'react';
import { Draggable, DroppableProvided } from 'react-beautiful-dnd';
import KanbanCard from './KanbanCard';
import { Task } from '../../types/kanban';

interface KanbanColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
  innerRef?: (element: HTMLElement | null) => void;
  droppableProps?: DroppableProvided['droppableProps'];
}

const KanbanColumn: React.FC<KanbanColumnProps> = React.forwardRef(
  ({ columnId, title, tasks, innerRef, droppableProps }, ref) => {
    return (
      <div className="kanban-column" ref={innerRef} {...droppableProps}>
        <h2>{title}</h2>
        <div className="kanban-cards">
          {tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(provided) => (
                <KanbanCard
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  key={task.id}
                  task={task}
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      </div>
    );
  }
);

export default KanbanBoard;
