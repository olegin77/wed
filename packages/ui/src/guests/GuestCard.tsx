import React from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';

export interface Guest {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  diet?: string;
  plusOne: boolean;
  status: 'INVITED' | 'GOING' | 'DECLINED' | 'NO_RESPONSE';
  tableId?: string;
  tableName?: string;
  notes?: string;
  group?: 'family' | 'groom_friends' | 'bride_friends' | 'colleagues' | 'other';
}

interface GuestCardProps {
  guest: Guest;
  onUpdate?: (guest: Partial<Guest>) => void;
  onDelete?: (guestId: string) => void;
  onSendInvitation?: (guestId: string) => void;
  showActions?: boolean;
  className?: string;
}

const statusColors = {
  INVITED: 'bg-yellow-100 text-yellow-800',
  GOING: 'bg-green-100 text-green-800',
  DECLINED: 'bg-red-100 text-red-800',
  NO_RESPONSE: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  INVITED: 'Приглашен',
  GOING: 'Идет',
  DECLINED: 'Отказался',
  NO_RESPONSE: 'Нет ответа',
};

const groupLabels = {
  family: 'Семья',
  groom_friends: 'Друзья жениха',
  bride_friends: 'Друзья невесты',
  colleagues: 'Коллеги',
  other: 'Другие',
};

export function GuestCard({
  guest,
  onUpdate,
  onDelete,
  onSendInvitation,
  showActions = true,
  className = '',
}: GuestCardProps) {
  const handleStatusChange = (newStatus: Guest['status']) => {
    onUpdate?.({ ...guest, status: newStatus });
  };

  const handleFieldUpdate = (field: keyof Guest, value: string | boolean) => {
    onUpdate?.({ ...guest, [field]: value });
  };

  return (
    <Card className={`p-4 space-y-3 ${className}`}>
      {/* Header with name and status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900">{guest.name}</h3>
          {guest.plusOne && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              +1
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[guest.status]}`}>
            {statusLabels[guest.status]}
          </span>
          {guest.group && (
            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
              {groupLabels[guest.group]}
            </span>
          )}
        </div>
      </div>

      {/* Contact information */}
      <div className="space-y-2">
        {guest.phone && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">📞</span>
            <span className="text-sm text-gray-700">{guest.phone}</span>
          </div>
        )}
        {guest.email && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">✉️</span>
            <span className="text-sm text-gray-700">{guest.email}</span>
          </div>
        )}
      </div>

      {/* Table assignment */}
      {guest.tableName && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">🪑</span>
          <span className="text-sm text-gray-700">Стол: {guest.tableName}</span>
        </div>
      )}

      {/* Dietary restrictions */}
      {guest.diet && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">🍽️</span>
          <span className="text-sm text-gray-700">Диета: {guest.diet}</span>
        </div>
      )}

      {/* Notes */}
      {guest.notes && (
        <div className="p-2 bg-gray-50 rounded-md">
          <span className="text-sm text-gray-500">📝 Заметки:</span>
          <p className="text-sm text-gray-700 mt-1">{guest.notes}</p>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={guest.status === 'GOING' ? 'primary' : 'secondary'}
              onClick={() => handleStatusChange('GOING')}
            >
              Идет
            </Button>
            <Button
              size="sm"
              variant={guest.status === 'DECLINED' ? 'primary' : 'secondary'}
              onClick={() => handleStatusChange('DECLINED')}
            >
              Отказался
            </Button>
          </div>
          <div className="flex space-x-2">
            {onSendInvitation && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSendInvitation(guest.id)}
              >
                Отправить приглашение
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(guest.id)}
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
export function GuestCardCompact({
  guest,
  onUpdate,
  className = '',
}: Pick<GuestCardProps, 'guest' | 'onUpdate' | 'className'>) {
  return (
    <div className={`flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="flex items-center space-x-3">
        <div>
          <h4 className="font-medium text-gray-900">{guest.name}</h4>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {guest.phone && <span>📞 {guest.phone}</span>}
            {guest.email && <span>✉️ {guest.email}</span>}
            {guest.tableName && <span>🪑 {guest.tableName}</span>}
          </div>
        </div>
        {guest.plusOne && (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            +1
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[guest.status]}`}>
          {statusLabels[guest.status]}
        </span>
        {onUpdate && (
          <select
            value={guest.status}
            onChange={(e) => onUpdate({ ...guest, status: e.target.value as Guest['status'] })}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="INVITED">Приглашен</option>
            <option value="GOING">Идет</option>
            <option value="DECLINED">Отказался</option>
            <option value="NO_RESPONSE">Нет ответа</option>
          </select>
        )}
      </div>
    </div>
  );
}