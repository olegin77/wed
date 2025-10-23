import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { AssigneeType, ASSIGNEE_LABELS, ASSIGNEE_ICONS } from './types';

interface AssigneeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (assignee: { type: AssigneeType; name?: string; contact?: string }) => void;
  currentAssignee?: { type: AssigneeType; name?: string; contact?: string };
}

export function AssigneeModal({
  isOpen,
  onClose,
  onAssign,
  currentAssignee,
}: AssigneeModalProps) {
  const [assigneeType, setAssigneeType] = useState<AssigneeType>(
    currentAssignee?.type || 'groom'
  );
  const [name, setName] = useState(currentAssignee?.name || '');
  const [contact, setContact] = useState(currentAssignee?.contact || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign({
      type: assigneeType,
      name: name.trim() || undefined,
      contact: contact.trim() || undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Назначить ответственного</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Assignee Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип ответственного
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(ASSIGNEE_LABELS).map(([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAssigneeType(type as AssigneeType)}
                    className={`p-3 text-left border rounded-lg transition-colors ${
                      assigneeType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{ASSIGNEE_ICONS[type as AssigneeType]}</span>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя (необязательно)
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите имя ответственного"
              />
            </div>

            {/* Contact (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Контакт (необязательно)
              </label>
              <Input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Телефон или email"
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
                Назначить
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

// Quick assign component for inline use
interface QuickAssignProps {
  currentAssignee?: { type: AssigneeType; name?: string; contact?: string };
  onAssign: (assignee: { type: AssigneeType; name?: string; contact?: string }) => void;
  className?: string;
}

export function QuickAssign({
  currentAssignee,
  onAssign,
  className = '',
}: QuickAssignProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-gray-400 transition-colors ${className}`}
      >
        {currentAssignee ? (
          <>
            <span className="text-lg">{ASSIGNEE_ICONS[currentAssignee.type]}</span>
            <span>{ASSIGNEE_LABELS[currentAssignee.type]}</span>
            {currentAssignee.name && (
              <span className="text-gray-500">- {currentAssignee.name}</span>
            )}
          </>
        ) : (
          <>
            <span className="text-lg">👤</span>
            <span>Назначить</span>
          </>
        )}
      </button>

      <AssigneeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAssign={onAssign}
        currentAssignee={currentAssignee}
      />
    </>
  );
}