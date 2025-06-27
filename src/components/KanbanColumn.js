import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';

const KanbanColumn = ({ id, title, tasks, color, onEditTask, onDeleteTask, onAddTask }) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });
  const getColorClasses = (color) => {
    switch (color) {
      case 'wine': return 'bg-[#2d2d30] border-l-4 border-l-[#ff605c]';
      case 'lavender': return 'bg-[#2d2d30] border-l-4 border-l-[#ffbd44]';
      case 'turquoise': return 'bg-[#2d2d30] border-l-4 border-l-[#00ca4e]';
      default: return 'bg-[#2d2d30] border-l-4 border-l-[#6c757d]';
    }
  };

  const getHeaderColor = (color) => {
    switch (color) {
      case 'wine': return 'text-[#d73a49]';
      case 'lavender': return 'text-[#6f42c1]';
      case 'turquoise': return 'text-[#17a2b8]';
      default: return 'text-[#6c757d]';
    }
  };

  return (
      <div className={`rounded border border-[#464647] ${getColorClasses(color)}`}>
        <div className="px-3 py-2 border-b border-[#464647]">
          <div className="flex items-center gap-2">
            <h2 className="font-medium text-sm text-[#d4d4d4]">{title}</h2>
            <span className="text-xs text-[#858585] bg-[#404040] px-1.5 py-0.5 rounded">{tasks.length}</span>
          </div>
        </div>
        <div
            ref={setNodeRef}
            className="space-y-2 h-[calc(100vh-140px)] overflow-y-auto p-3 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
        >
          <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
                <KanbanCard
                    key={task.id}
                    id={task.id}
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                />
            ))}
          </SortableContext>
          {tasks.length === 0 && (
              <div className="text-[#858585] text-center py-8 text-xs">
                Nenhuma tarefa
              </div>
          )}

          {/* Botão Add Task no final da coluna */}
          <button
              onClick={onAddTask}
              className="w-full p-3 border-2 border-dashed border-[#464647] rounded text-[#858585] hover:border-[#007acc] hover:text-[#007acc] transition-colors text-sm flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar task
          </button>
        </div>
      </div>
  );
};

export default KanbanColumn;