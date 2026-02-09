import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import KanbanColumn from './KanbanColumn';
import { useKanbanStore } from '../../store/kanbanStore';
import './../../styles/Kanban.css';

const KanbanBoard: React.FC = () => {
  const { columns, moveTask, reorderTasksInColumn } = useKanbanStore();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      reorderTasksInColumn(source.droppableId, source.index, destination.index);
    } else {
      // Moving task between columns
      moveTask(draggableId, source.droppableId, destination.droppableId, destination.index);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {Object.entries(columns).map(([columnId, column]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <KanbanColumn
                ref={provided.innerRef}
                {...provided.droppableProps}
                key={columnId}
                columnId={columnId}
                title={column.title}
                tasks={column.tasks}
              />
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
