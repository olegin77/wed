import React, { useState } from 'react';
import { TaskCard, TaskCardCompact } from './TaskCard';
import { AssigneeModal, QuickAssign } from './AssigneeModal';
import { ChecklistTask, AssigneeType, ASSIGNEE_LABELS, ASSIGNEE_ICONS } from './types';

interface ChecklistBoardProps {
  tasks: ChecklistTask[];
  onUpdateTask?: (task: Partial<ChecklistTask>) => void;
  onDeleteTask?: (taskId: string) => void;
  onAssignTask?: (taskId: string, assignee: ChecklistTask['assignee']) => void;
  viewMode?: 'card' | 'compact' | 'kanban';
  showUnassigned?: boolean;
  className?: string;
}

export function ChecklistBoard({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onAssignTask,
  viewMode = 'card',
  showUnassigned = true,
  className = '',
}: ChecklistBoardProps) {
  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean;
    taskId: string;
    currentAssignee?: ChecklistTask['assignee'];
  }>({
    isOpen: false,
    taskId: '',
  });

  const handleAssign = (taskId: string, assignee: ChecklistTask['assignee']) => {
    onAssignTask?.(taskId, assignee);
    setAssignModal({ isOpen: false, taskId: '' });
  };

  const openAssignModal = (taskId: string, currentAssignee?: ChecklistTask['assignee']) => {
    setAssignModal({ isOpen: true, taskId, currentAssignee });
  };

  // Group tasks by assignee
  const groupedTasks = tasks.reduce((acc, task) => {
    const assigneeType = task.assignee?.type || 'unassigned';
    if (!acc[assigneeType]) {
      acc[assigneeType] = [];
    }
    acc[assigneeType].push(task);
    return acc;
  }, {} as Record<string, ChecklistTask[]>);

  const assigneeTypes: AssigneeType[] = ['groom', 'bride', 'organizer', 'vendor', 'family', 'other'];

  const renderTask = (task: ChecklistTask) => {
    const commonProps = {
      task,
      onUpdate: onUpdateTask,
      onDelete: onDeleteTask,
      onAssign: (assignee?: ChecklistTask['assignee']) => openAssignModal(task.id, assignee),
    };

    switch (viewMode) {
      case 'compact':
        return <TaskCardCompact key={task.id} {...commonProps} />;
      default:
        return <TaskCard key={task.id} {...commonProps} />;
    }
  };

  const renderAssigneeColumn = (assigneeType: AssigneeType, tasks: ChecklistTask[]) => {
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      pending: tasks.filter(t => t.status === 'pending').length,
    };

    return (
      <div key={assigneeType} className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">{ASSIGNEE_ICONS[assigneeType]}</span>
            <h3 className="text-lg font-semibold text-gray-900">
              {ASSIGNEE_LABELS[assigneeType]}
            </h3>
            <span className="px-2 py-1 text-sm font-medium bg-white text-gray-800 rounded-full">
              {stats.total}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center">
              <div className="font-bold text-green-600">{stats.completed}</div>
              <div className="text-gray-600">Завершено</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-600">{stats.inProgress}</div>
              <div className="text-gray-600">В работе</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-gray-600">Ожидает</div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {tasks.map(renderTask)}
        </div>
      </div>
    );
  };

  if (viewMode === 'kanban') {
    return (
      <div className={`flex space-x-6 overflow-x-auto ${className}`}>
        {assigneeTypes.map(assigneeType => {
          const tasks = groupedTasks[assigneeType] || [];
          return renderAssigneeColumn(assigneeType, tasks);
        })}
        {showUnassigned && groupedTasks.unassigned && (
          <div className="flex-1 min-w-0">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">❓</span>
                <h3 className="text-lg font-semibold text-gray-900">Не назначено</h3>
                <span className="px-2 py-1 text-sm font-medium bg-white text-gray-800 rounded-full">
                  {groupedTasks.unassigned.length}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {groupedTasks.unassigned.map(renderTask)}
            </div>
          </div>
        )}
        
        <AssigneeModal
          isOpen={assignModal.isOpen}
          onClose={() => setAssignModal({ isOpen: false, taskId: '' })}
          onAssign={(assignee) => handleAssign(assignModal.taskId, assignee)}
          currentAssignee={assignModal.currentAssignee}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {assigneeTypes.map(assigneeType => {
        const tasks = groupedTasks[assigneeType] || [];
        if (tasks.length === 0) return null;
        
        return (
          <div key={assigneeType}>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">{ASSIGNEE_ICONS[assigneeType]}</span>
              <h3 className="text-xl font-semibold text-gray-900">
                {ASSIGNEE_LABELS[assigneeType]}
              </h3>
              <span className="px-2 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                {tasks.length} задач
              </span>
            </div>
            <div className={`
              ${viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}
            `}>
              {tasks.map(renderTask)}
            </div>
          </div>
        );
      })}
      
      {showUnassigned && groupedTasks.unassigned && groupedTasks.unassigned.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">❓</span>
            <h3 className="text-xl font-semibold text-gray-900">Не назначено</h3>
            <span className="px-2 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
              {groupedTasks.unassigned.length} задач
            </span>
          </div>
          <div className={`
            ${viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}
          `}>
            {groupedTasks.unassigned.map(renderTask)}
          </div>
        </div>
      )}
      
      <AssigneeModal
        isOpen={assignModal.isOpen}
        onClose={() => setAssignModal({ isOpen: false, taskId: '' })}
        onAssign={(assignee) => handleAssign(assignModal.taskId, assignee)}
        currentAssignee={assignModal.currentAssignee}
      />
    </div>
  );
}