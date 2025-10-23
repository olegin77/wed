import React from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { 
  ChecklistTask, 
  ASSIGNEE_LABELS, 
  ASSIGNEE_ICONS, 
  PRIORITY_LABELS, 
  PRIORITY_COLORS,
  STATUS_LABELS,
  STATUS_COLORS 
} from './types';

interface TaskCardProps {
  task: ChecklistTask;
  onUpdate?: (task: Partial<ChecklistTask>) => void;
  onDelete?: (taskId: string) => void;
  onAssign?: (taskId: string, assignee: ChecklistTask['assignee']) => void;
  showActions?: boolean;
  className?: string;
}

export function TaskCard({
  task,
  onUpdate,
  onDelete,
  onAssign,
  showActions = true,
  className = '',
}: TaskCardProps) {
  const handleStatusChange = (newStatus: ChecklistTask['status']) => {
    onUpdate?.({
      ...task,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date() : undefined,
    });
  };

  const handlePriorityChange = (newPriority: ChecklistTask['priority']) => {
    onUpdate?.({ ...task, priority: newPriority });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formatDuration = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} мин`;
    }
    return `${hours} ч`;
  };

  return (
    <Card className={`p-4 space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${PRIORITY_COLORS[task.priority]}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[task.status]}`}>
            {STATUS_LABELS[task.status]}
          </span>
        </div>
      </div>

      {/* Assignee */}
      {task.assignee && (
        <div className="flex items-center space-x-2">
          <span className="text-lg">{ASSIGNEE_ICONS[task.assignee.type]}</span>
          <div>
            <span className="text-sm font-medium text-gray-700">
              {ASSIGNEE_LABELS[task.assignee.type]}
            </span>
            {task.assignee.name && (
              <span className="text-sm text-gray-500 ml-2">
                - {task.assignee.name}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Due Date */}
      {task.dueDate && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">📅</span>
          <span className="text-sm text-gray-700">
            Срок: {formatDate(task.dueDate)}
          </span>
        </div>
      )}

      {/* Duration */}
      {(task.estimatedDuration || task.actualDuration) && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">⏱️</span>
          <span className="text-sm text-gray-700">
            {task.estimatedDuration && `Планируется: ${formatDuration(task.estimatedDuration)}`}
            {task.estimatedDuration && task.actualDuration && ' • '}
            {task.actualDuration && `Фактически: ${formatDuration(task.actualDuration)}`}
          </span>
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Notes */}
      {task.notes && (
        <div className="p-2 bg-gray-50 rounded-md">
          <span className="text-sm text-gray-500">📝 Заметки:</span>
          <p className="text-sm text-gray-700 mt-1">{task.notes}</p>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex space-x-2">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as ChecklistTask['status'])}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="pending">Ожидает</option>
              <option value="in_progress">В работе</option>
              <option value="completed">Завершено</option>
              <option value="cancelled">Отменено</option>
            </select>
            <select
              value={task.priority}
              onChange={(e) => handlePriorityChange(e.target.value as ChecklistTask['priority'])}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
              <option value="urgent">Срочный</option>
            </select>
          </div>
          <div className="flex space-x-2">
            {onAssign && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAssign(task.id, task.assignee)}
              >
                Назначить
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(task.id)}
              >
                Удалить
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

// Compact version for lists
export function TaskCardCompact({
  task,
  onUpdate,
  className = '',
}: Pick<TaskCardProps, 'task' | 'onUpdate' | 'className'>) {
  return (
    <div className={`flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={task.status === 'completed'}
          onChange={(e) => onUpdate?.({ ...task, status: e.target.checked ? 'completed' : 'pending' })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <div>
          <h4 className="font-medium text-gray-900">{task.title}</h4>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {task.assignee && (
              <span>
                {ASSIGNEE_ICONS[task.assignee.type]} {ASSIGNEE_LABELS[task.assignee.type]}
              </span>
            )}
            {task.dueDate && (
              <span>📅 {new Intl.DateTimeFormat('ru-RU').format(task.dueDate)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${PRIORITY_COLORS[task.priority]}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[task.status]}`}>
          {STATUS_LABELS[task.status]}
        </span>
      </div>
    </div>
  );
}