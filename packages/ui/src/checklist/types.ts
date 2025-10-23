export type AssigneeType = 'groom' | 'bride' | 'organizer' | 'vendor' | 'family' | 'other';

export interface ChecklistTask {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignee?: {
    type: AssigneeType;
    name?: string;
    contact?: string;
  };
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  dependencies?: string[]; // IDs of tasks that must be completed first
  tags?: string[];
  notes?: string;
  estimatedDuration?: number; // in hours
  actualDuration?: number; // in hours
}

export interface ChecklistCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  order: number;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  description?: string;
  categories: ChecklistCategory[];
  tasks: Omit<ChecklistTask, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>[];
  isDefault?: boolean;
  createdBy?: string;
}

export const ASSIGNEE_LABELS: Record<AssigneeType, string> = {
  groom: 'Жених',
  bride: 'Невеста',
  organizer: 'Организатор',
  vendor: 'Поставщик',
  family: 'Семья',
  other: 'Другие',
};

export const ASSIGNEE_ICONS: Record<AssigneeType, string> = {
  groom: '👨',
  bride: '👩',
  organizer: '📋',
  vendor: '🏢',
  family: '👨‍👩‍👧‍👦',
  other: '👤',
};

export const PRIORITY_LABELS: Record<ChecklistTask['priority'], string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  urgent: 'Срочный',
};

export const PRIORITY_COLORS: Record<ChecklistTask['priority'], string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

export const STATUS_LABELS: Record<ChecklistTask['status'], string> = {
  pending: 'Ожидает',
  in_progress: 'В работе',
  completed: 'Завершено',
  cancelled: 'Отменено',
};

export const STATUS_COLORS: Record<ChecklistTask['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
};