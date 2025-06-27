import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const KanbanCard = ({ id, task, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Alta': return 'bg-[#d73a49]/20 border-[#d73a49]/50 text-[#f97583]';
            case 'Média': return 'bg-[#ffd33d]/20 border-[#ffd33d]/50 text-[#ffd33d]';
            case 'Baixa': return 'bg-[#28a745]/20 border-[#28a745]/50 text-[#85e89d]';
            default: return 'bg-[#6c757d]/20 border-[#6c757d]/50 text-[#6c757d]';
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-[#3c3c3c] p-3 rounded border border-[#464647] hover:bg-[#404040] transition-colors group ${
                isDragging ? 'shadow-2xl bg-[#404040] border-[#007acc] opacity-50' : ''
            }`}
        >
            {/* Botões de ação */}
            <div className="flex justify-end gap-1 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(task);
                    }}
                    className="p-1 text-[#858585] hover:text-[#007acc] transition-colors rounded"
                    title="Editar"
                >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task.id);
                    }}
                    className="p-1 text-[#858585] hover:text-[#d73a49] transition-colors rounded"
                    title="Excluir"
                >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
            >
                <h3 className="font-medium text-[#d4d4d4] mb-1.5 text-sm">{task.title}</h3>
                <p className="text-[#858585] text-xs mb-2 leading-relaxed">{task.description}</p>
                <div className="flex justify-between items-center">
          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
                    <span className="text-xs text-[#858585]">{task.date}</span>
                </div>
            </div>
        </div>
    );
};

export default KanbanCard;