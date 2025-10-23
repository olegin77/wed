import React, { useState, useEffect } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { Guest } from './GuestCard';

interface GuestEditModalProps {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (guest: Guest) => void;
  tables?: Array<{ id: string; name: string }>;
}

export function GuestEditModal({
  guest,
  isOpen,
  onClose,
  onSave,
  tables = [],
}: GuestEditModalProps) {
  const [formData, setFormData] = useState<Partial<Guest>>({});

  useEffect(() => {
    if (guest) {
      setFormData(guest);
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        diet: '',
        plusOne: false,
        status: 'INVITED',
        group: 'other',
        notes: '',
      });
    }
  }, [guest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name) {
      onSave(formData as Guest);
      onClose();
    }
  };

  const handleChange = (field: keyof Guest, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {guest ? 'Редактировать гостя' : 'Добавить гостя'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя *
              </label>
              <Input
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Введите имя гостя"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон
                </label>
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+998 90 123 45 67"
                  type="tel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="guest@example.com"
                  type="email"
                />
              </div>
            </div>

            {/* Group Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Группа
              </label>
              <select
                value={formData.group || 'other'}
                onChange={(e) => handleChange('group', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="family">Семья</option>
                <option value="groom_friends">Друзья жениха</option>
                <option value="bride_friends">Друзья невесты</option>
                <option value="colleagues">Коллеги</option>
                <option value="other">Другие</option>
              </select>
            </div>

            {/* Table Assignment */}
            {tables.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Стол
                </label>
                <select
                  value={formData.tableId || ''}
                  onChange={(e) => handleChange('tableId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Не назначен</option>
                  {tables.map(table => (
                    <option key={table.id} value={table.id}>
                      {table.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус RSVP
              </label>
              <select
                value={formData.status || 'INVITED'}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="INVITED">Приглашен</option>
                <option value="GOING">Идет</option>
                <option value="DECLINED">Отказался</option>
                <option value="NO_RESPONSE">Нет ответа</option>
              </select>
            </div>

            {/* Plus One */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="plusOne"
                checked={formData.plusOne || false}
                onChange={(e) => handleChange('plusOne', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="plusOne" className="ml-2 block text-sm text-gray-700">
                Приходит с сопровождающим (+1)
              </label>
            </div>

            {/* Dietary Restrictions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Диетические ограничения
              </label>
              <Input
                value={formData.diet || ''}
                onChange={(e) => handleChange('diet', e.target.value)}
                placeholder="Вегетарианство, аллергии и т.д."
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Заметки
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Дополнительная информация о госте"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                {guest ? 'Сохранить' : 'Добавить'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}