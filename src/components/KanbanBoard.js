import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import KanbanColumn from "./KanbanColumn";

const KanbanBoard = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: "",
    priority: "Média"
  });

  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
  );

  // Função para carregar dados do localStorage
  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('kanban-data');
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
    return null;
  };

  // Dados iniciais (fallback se não houver localStorage)
  const initialData = {
    pendingTasks: [
      {
        id: "1",
        title: "Missão 13: DevSecOps",
        description: "Entrega até 30 de junho",
        priority: "Alta",
        date: "30 de junho"
      },
      {
        id: "2",
        title: "Missão 14: Introdução ao Design",
        description: "Entrega até 2 de julho",
        priority: "Média",
        date: "2 de julho"
      },
      {
        id: "3",
        title: "Qualidade de Software",
        description: "Definição, atributos (funcionalidade, confiabilidade, usabilidade, eficiência etc.), métricas de qualidade, padrões ISO, custo da má qualidade",
        priority: "Alta",
        date: "30 de junho"
      },
      {
        id: "4",
        title: "Fundamentos do Teste de Software",
        description: "Tipos de teste (unitário, integração, sistema, aceitação), teste caixa-preta e branca, critérios de teste, TDD",
        priority: "Alta",
        date: "30 de junho"
      }
    ],
    inProgressTasks: [
      {
        id: "5",
        title: "Testes Avançados de Software",
        description: "Testes exploratórios, automação, testes em pipelines CI/CD, mocks e stubs, cobertura de código",
        priority: "Média",
        date: "30 de junho"
      },
      {
        id: "6",
        title: "Garantia de Qualidade Contínua",
        description: "Integração de testes no ciclo de vida do software, métricas de qualidade contínua, monitoramento",
        priority: "Alta",
        date: "30 de junho"
      },
      {
        id: "7",
        title: "DevOps e Integração Contínua",
        description: "Práticas de CI/CD, pipelines automatizados, ferramentas (ex: Jenkins, GitHub Actions), feedback rápido",
        priority: "Média",
        date: "30 de junho"
      },
      {
        id: "8",
        title: "DevSecOps e Segurança no Desenvolvimento",
        description: "Integração de segurança desde o início, SAST, DAST, gerenciamento de vulnerabilidades, cultura de segurança compartilhada",
        priority: "Média",
        date: "30 de junho"
      }
    ],
    completedTasks: [
      {
        id: "27",
        title: "Desafio React",
        description: "Interface Kanban com React, drag & drop, componentização e hooks",
        priority: "Alta",
        date: "27 de junho"
      },
      {
        id: "26",
        title: "Missão 12",
        description: "Concluída",
        priority: "Média",
        date: "Concluído"
      },
      {
        id: "25",
        title: "Missão 11",
        description: "Concluída",
        priority: "Média",
        date: "Concluído"
      },
      {
        id: "24",
        title: "Missão 10",
        description: "Concluída",
        priority: "Média",
        date: "Concluído"
      },
      {
        id: "23",
        title: "Missão 9",
        description: "Concluída",
        priority: "Média",
        date: "Concluído"
      },
      {
        id: "22",
        title: "Missão 8",
        description: "Concluída",
        priority: "Média",
        date: "Concluído"
      },
      {
        id: "21",
        title: "Missão 7",
        description: "Concluída",
        priority: "Média",
        date: "Concluído"
      },
      {
        id: "20",
        title: "Engenharia de Requisitos",
        description: "Elicitação, análise, especificação, validação, requisitos funcionais vs não-funcionais, técnicas (entrevista, protótipo, brainstorming)",
        priority: "Alta",
        date: "Concluído"
      },
      {
        id: "19",
        title: "Missão 6",
        description: "Concluída",
        priority: "Média",
        date: "Concluído"
      },
      {
        id: "18",
        title: "Metodologias Ágeis em Escala",
        description: "Escalando Scrum, desafios em grandes equipes, estruturas como SAFe, LeSS, Spotify",
        priority: "Alta",
        date: "Concluído"
      },
      {
        id: "17",
        title: "Missão 5",
        description: "Concluída",
        priority: "Média",
        date: "Concluído"
      },
      {
        id: "16",
        title: "Modelos de Processo de Desenvolvimento",
        description: "Cascata, incremental, iterativo, modelos ágeis (Scrum, XP, Kanban), híbridos (Scrum-Waterfall, SAFe), critérios de escolha",
        priority: "Alta",
        date: "Concluído"
      },
      {
        id: "15",
        title: "Missão 4",
        description: "Concluída",
        priority: "Média",
        date: "Concluído"
      },
      {
        id: "14",
        title: "Gestão de Configuração e Controle de Versão",
        description: "Versionamento com Git, estratégias Git Flow, Feature Branch, Trunk-Based, ferramentas (GitHub, GitLab), pull requests e CI",
        priority: "Alta",
        date: "Concluído"
      },
      {
        id: "13",
        title: "Missão 3",
        description: "Concluída",
        priority: "Média",
        date: "Concluído"
      },
      {
        id: "12",
        title: "Histórico e Evolução da ES",
        description: "Eras da ES (mainframes, OO, distribuídos, ágeis, DevOps), automação, tendências futuras",
        priority: "Alta",
        date: "Concluído"
      },
      {
        id: "11",
        title: "Missão 2",
        description: "Concluída",
        priority: "Média",
        date: "Concluído"
      },
      {
        id: "10",
        title: "Introdução à Engenharia de Software",
        description: "Definição, importância, falhas históricas (Therac-25, Ariane 5, Healthcare.gov), crise do software",
        priority: "Alta",
        date: "Concluído"
      },
      {
        id: "9",
        title: "Missão 1",
        description: "Concluída",
        priority: "Média",
        date: "Concluído"
      }
    ]
  };

  // Carregar dados do localStorage ou usar dados iniciais
  const savedData = loadFromLocalStorage();

  const [pendingTasks, setPendingTasks] = useState(savedData?.pendingTasks || initialData.pendingTasks);
  const [inProgressTasks, setInProgressTasks] = useState(savedData?.inProgressTasks || initialData.inProgressTasks);
  const [completedTasks, setCompletedTasks] = useState(savedData?.completedTasks || initialData.completedTasks);

  // useEffect para salvar dados no localStorage sempre que as tasks mudarem
  useEffect(() => {
    const dataToSave = {
      pendingTasks,
      inProgressTasks,
      completedTasks,
      lastUpdated: new Date().toISOString()
    };

    try {
      localStorage.setItem('kanban-data', JSON.stringify(dataToSave));
      console.log('Dados salvos no localStorage');
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }, [pendingTasks, inProgressTasks, completedTasks]);

  // useEffect para mostrar estatísticas no console (demonstrar useEffect)
  useEffect(() => {
    const totalTasks = pendingTasks.length + inProgressTasks.length + completedTasks.length;
    const completionRate = totalTasks > 0 ? ((completedTasks.length / totalTasks) * 100).toFixed(1) : 0;

    console.log(`📊 Estatísticas do Kanban:
    - Total de tasks: ${totalTasks}
    - Pendentes: ${pendingTasks.length}
    - Em andamento: ${inProgressTasks.length} 
    - Concluídas: ${completedTasks.length}
    - Taxa de conclusão: ${completionRate}%`);
  }, [pendingTasks.length, inProgressTasks.length, completedTasks.length]);

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task = {
      id: Date.now().toString(),
      ...newTask
    };

    setPendingTasks([...pendingTasks, task]);
    setNewTask({ title: "", description: "", date: "", priority: "Média" });
    setShowAddModal(false);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleUpdateTask = () => {
    if (!editingTask.title.trim()) return;

    const updateTaskInArray = (tasks, setTasks) => {
      const updated = tasks.map(task =>
          task.id === editingTask.id ? editingTask : task
      );
      if (updated.some(task => task.id === editingTask.id)) {
        setTasks(updated);
        return true;
      }
      return false;
    };

    const found = updateTaskInArray(pendingTasks, setPendingTasks) ||
        updateTaskInArray(inProgressTasks, setInProgressTasks) ||
        updateTaskInArray(completedTasks, setCompletedTasks);

    if (found) {
      setEditingTask(null);
      setShowEditModal(false);
    }
  };

  const handleDeleteTask = (taskId) => {
    setPendingTasks(pendingTasks.filter(task => task.id !== taskId));
    setInProgressTasks(inProgressTasks.filter(task => task.id !== taskId));
    setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
  };

  // Função para lidar com o drag and drop
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Encontrar qual coluna contém a task ativa
    const findContainer = (id) => {
      if (pendingTasks.find(task => task.id === id)) return 'pending';
      if (inProgressTasks.find(task => task.id === id)) return 'inProgress';
      if (completedTasks.find(task => task.id === id)) return 'completed';
      return id; // Se for um droppable container
    };

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    // Se está sendo dropado em um container diferente
    if (activeContainer !== overContainer) {
      const activeItems = getTasksByContainer(activeContainer);
      const overItems = getTasksByContainer(overContainer);

      const activeIndex = activeItems.findIndex(task => task.id === activeId);
      const overIndex = overItems.findIndex(task => task.id === overId);

      const [movedTask] = activeItems.splice(activeIndex, 1);

      if (overId === overContainer) {
        // Dropado no container vazio
        overItems.push(movedTask);
      } else {
        // Dropado em uma task específica
        overItems.splice(overIndex, 0, movedTask);
      }

      setTasksByContainer(activeContainer, activeItems);
      setTasksByContainer(overContainer, overItems);
    } else {
      // Reordenando dentro da mesma coluna
      const items = getTasksByContainer(activeContainer);
      const oldIndex = items.findIndex(task => task.id === activeId);
      const newIndex = items.findIndex(task => task.id === overId);

      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      setTasksByContainer(activeContainer, reorderedItems);
    }
  };

  const getTasksByContainer = (containerId) => {
    switch (containerId) {
      case 'pending': return pendingTasks;
      case 'inProgress': return inProgressTasks;
      case 'completed': return completedTasks;
      default: return [];
    }
  };

  const setTasksByContainer = (containerId, tasks) => {
    switch (containerId) {
      case 'pending': setPendingTasks(tasks); break;
      case 'inProgress': setInProgressTasks(tasks); break;
      case 'completed': setCompletedTasks(tasks); break;
    }
  };

  const filterTasks = (tasks) => {
    if (!searchTerm) return tasks;
    return tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
      <div className="min-h-screen bg-[#252526]">
        {/* Header */}
        <div className="bg-[#1e1e1e] border-b border-[#333] px-12 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#ff605c]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd44]"></div>
              <div className="w-3 h-3 rounded-full bg-[#00ca4e]"></div>
              <h1 className="text-[#d4d4d4] text-lg font-medium ml-4">Kanban Board</h1>
            </div>

            <div className="flex gap-3 items-center">
              {/* Campo de busca */}
              <div className="relative">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#3c3c3c] text-[#cccccc] px-3 py-1.5 rounded border border-[#464647] focus:border-[#007acc] focus:outline-none w-48 text-sm"
                />
                <svg className="absolute right-2.5 top-2 h-4 w-4 text-[#858585]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Botão Add Task */}
              <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-[#0e639c] hover:bg-[#1177bb] text-[#ffffff] px-3 py-1.5 rounded flex items-center gap-2 transition-colors text-sm"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nova Task
              </button>
            </div>
          </div>
        </div>

        {/* Modal Add Task */}
        {showAddModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-[#2d2d30] border border-[#464647] rounded-lg w-96 shadow-2xl">
                <div className="bg-[#2d2d30] border border-[#464647] rounded-lg w-96 shadow-2xl">
                  <div className="bg-[#3c3c3c] px-4 py-3 rounded-t-lg border-b border-[#464647]">
                    <h2 className="text-[#cccccc] font-medium">Adicionar Nova Task</h2>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <label className="block text-[#cccccc] text-sm mb-1">Título</label>
                      <input
                          type="text"
                          value={newTask.title}
                          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                          className="w-full bg-[#3c3c3c] text-[#cccccc] px-3 py-2 rounded border border-[#464647] focus:border-[#007acc] focus:outline-none text-sm"
                          placeholder="Digite o título da task..."
                      />
                    </div>

                    <div>
                      <label className="block text-[#cccccc] text-sm mb-1">Descrição</label>
                      <textarea
                          value={newTask.description}
                          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                          className="w-full bg-[#3c3c3c] text-[#cccccc] px-3 py-2 rounded border border-[#464647] focus:border-[#007acc] focus:outline-none text-sm h-16 resize-none"
                          placeholder="Digite a descrição..."
                      />
                    </div>

                    <div>
                      <label className="block text-[#cccccc] text-sm mb-1">Data</label>
                      <input
                          type="text"
                          value={newTask.date}
                          onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                          className="w-full bg-[#3c3c3c] text-[#cccccc] px-3 py-2 rounded border border-[#464647] focus:border-[#007acc] focus:outline-none text-sm"
                          placeholder="Ex: 30 de junho"
                      />
                    </div>

                    <div>
                      <label className="block text-[#cccccc] text-sm mb-1">Prioridade</label>
                      <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                          className="w-full bg-[#3c3c3c] text-[#cccccc] px-3 py-2 rounded border border-[#464647] focus:border-[#007acc] focus:outline-none text-sm"
                      >
                        <option value="Alta">Alta</option>
                        <option value="Média">Média</option>
                        <option value="Baixa">Baixa</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 p-4 pt-0">
                    <button
                        onClick={handleAddTask}
                        className="flex-1 bg-[#0e639c] hover:bg-[#1177bb] text-white py-2 rounded transition-colors text-sm"
                    >
                      Adicionar
                    </button>
                    <button
                        onClick={() => setShowAddModal(false)}
                        className="flex-1 bg-[#3c3c3c] hover:bg-[#464647] text-[#cccccc] py-2 rounded transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Modal Edit Task */}
        {showEditModal && editingTask && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-[#2d2d30] border border-[#464647] rounded-lg w-96 shadow-2xl">
                <div className="bg-[#3c3c3c] px-4 py-3 rounded-t-lg border-b border-[#464647]">
                  <h2 className="text-[#cccccc] font-medium">Editar Task</h2>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-[#cccccc] text-sm mb-1">Título</label>
                    <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                        className="w-full bg-[#3c3c3c] text-[#cccccc] px-3 py-2 rounded border border-[#464647] focus:border-[#007acc] focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#cccccc] text-sm mb-1">Descrição</label>
                    <textarea
                        value={editingTask.description}
                        onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                        className="w-full bg-[#3c3c3c] text-[#cccccc] px-3 py-2 rounded border border-[#464647] focus:border-[#007acc] focus:outline-none text-sm h-16 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#cccccc] text-sm mb-1">Data</label>
                    <input
                        type="text"
                        value={editingTask.date}
                        onChange={(e) => setEditingTask({...editingTask, date: e.target.value})}
                        className="w-full bg-[#3c3c3c] text-[#cccccc] px-3 py-2 rounded border border-[#464647] focus:border-[#007acc] focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#cccccc] text-sm mb-1">Prioridade</label>
                    <select
                        value={editingTask.priority}
                        onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                        className="w-full bg-[#3c3c3c] text-[#cccccc] px-3 py-2 rounded border border-[#464647] focus:border-[#007acc] focus:outline-none text-sm"
                    >
                      <option value="Alta">Alta</option>
                      <option value="Média">Média</option>
                      <option value="Baixa">Baixa</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 p-4 pt-0">
                  <button
                      onClick={handleUpdateTask}
                      className="flex-1 bg-[#0e639c] hover:bg-[#1177bb] text-white py-2 rounded transition-colors text-sm"
                  >
                    Salvar
                  </button>
                  <button
                      onClick={() => {
                        setEditingTask(null);
                        setShowEditModal(false);
                      }}
                      className="flex-1 bg-[#3c3c3c] hover:bg-[#464647] text-[#cccccc] py-2 rounded transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Kanban Board */}
        <div className="px-12 py-4">
          <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <KanbanColumn
                  id="pending"
                  title="Pendente"
                  tasks={filterTasks(pendingTasks)}
                  color="wine"
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={() => setShowAddModal(true)}
              />
              <KanbanColumn
                  id="inProgress"
                  title="Realizando"
                  tasks={filterTasks(inProgressTasks)}
                  color="lavender"
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={() => setShowAddModal(true)}
              />
              <KanbanColumn
                  id="completed"
                  title="Concluída"
                  tasks={filterTasks(completedTasks)}
                  color="turquoise"
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={() => setShowAddModal(true)}
              />
            </div>
            <DragOverlay>
              {activeId ? (
                  <div className="bg-[#3c3c3c] p-3 rounded border border-[#007acc] shadow-2xl transform rotate-3">
                    <div className="font-medium text-[#d4d4d4] text-sm">
                      {[...pendingTasks, ...inProgressTasks, ...completedTasks]
                          .find(task => task.id === activeId)?.title}
                    </div>
                  </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
  );
};

export default KanbanBoard;