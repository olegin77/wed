import React from 'react';
import { Guest, GuestCard, GuestCardCompact } from './GuestCard';

interface GuestGroupProps {
  title: string;
  guests: Guest[];
  onUpdateGuest?: (guest: Partial<Guest>) => void;
  onDeleteGuest?: (guestId: string) => void;
  onSendInvitation?: (guestId: string) => void;
  viewMode?: 'card' | 'compact' | 'list';
  showStats?: boolean;
  className?: string;
}

const groupIcons = {
  family: '👨‍👩‍👧‍👦',
  groom_friends: '👨‍💼',
  bride_friends: '👩‍💼',
  colleagues: '👥',
  other: '👤',
};

export function GuestGroup({
  title,
  guests,
  onUpdateGuest,
  onDeleteGuest,
  onSendInvitation,
  viewMode = 'card',
  showStats = true,
  className = '',
}: GuestGroupProps) {
  const stats = {
    total: guests.length,
    going: guests.filter(g => g.status === 'GOING').length,
    declined: guests.filter(g => g.status === 'DECLINED').length,
    invited: guests.filter(g => g.status === 'INVITED').length,
    noResponse: guests.filter(g => g.status === 'NO_RESPONSE').length,
    plusOne: guests.filter(g => g.plusOne).length,
  };

  const renderGuest = (guest: Guest) => {
    switch (viewMode) {
      case 'compact':
        return (
          <GuestCardCompact
            key={guest.id}
            guest={guest}
            onUpdate={onUpdateGuest}
          />
        );
      case 'list':
        return (
          <div key={guest.id} className="flex items-center justify-between p-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">{guest.name}</span>
              {guest.plusOne && <span className="text-xs text-blue-600">+1</span>}
              {guest.tableName && <span className="text-xs text-gray-500">🪑 {guest.tableName}</span>}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                guest.status === 'GOING' ? 'bg-green-100 text-green-800' :
                guest.status === 'DECLINED' ? 'bg-red-100 text-red-800' :
                guest.status === 'INVITED' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {guest.status === 'GOING' ? 'Идет' :
                 guest.status === 'DECLINED' ? 'Отказался' :
                 guest.status === 'INVITED' ? 'Приглашен' : 'Нет ответа'}
              </span>
              {onSendInvitation && (
                <button
                  onClick={() => onSendInvitation(guest.id)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Пригласить
                </button>
              )}
            </div>
          </div>
        );
      default:
        return (
          <GuestCard
            key={guest.id}
            guest={guest}
            onUpdate={onUpdateGuest}
            onDelete={onDeleteGuest}
            onSendInvitation={onSendInvitation}
          />
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Group Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{groupIcons[title as keyof typeof groupIcons] || '👥'}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="px-2 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
            {stats.total} гостей
          </span>
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.going}</div>
            <div className="text-sm text-gray-600">Идут</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.invited}</div>
            <div className="text-sm text-gray-600">Приглашены</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
            <div className="text-sm text-gray-600">Отказались</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.noResponse}</div>
            <div className="text-sm text-gray-600">Нет ответа</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.plusOne}</div>
            <div className="text-sm text-gray-600">+1</div>
          </div>
        </div>
      )}

      {/* Guests List */}
      <div className={`
        ${viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}
      `}>
        {guests.length > 0 ? (
          guests.map(renderGuest)
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl">👥</span>
            <p className="mt-2">В этой группе пока нет гостей</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Guest Groups Container
interface GuestGroupsProps {
  guests: Guest[];
  onUpdateGuest?: (guest: Partial<Guest>) => void;
  onDeleteGuest?: (guestId: string) => void;
  onSendInvitation?: (guestId: string) => void;
  viewMode?: 'card' | 'compact' | 'list';
  showStats?: boolean;
  className?: string;
}

export function GuestGroups({
  guests,
  onUpdateGuest,
  onDeleteGuest,
  onSendInvitation,
  viewMode = 'card',
  showStats = true,
  className = '',
}: GuestGroupsProps) {
  const groupedGuests = guests.reduce((acc, guest) => {
    const group = guest.group || 'other';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(guest);
    return acc;
  }, {} as Record<string, Guest[]>);

  const groupTitles = {
    family: 'Семья',
    groom_friends: 'Друзья жениха',
    bride_friends: 'Друзья невесты',
    colleagues: 'Коллеги',
    other: 'Другие',
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {Object.entries(groupedGuests).map(([groupKey, groupGuests]) => (
        <GuestGroup
          key={groupKey}
          title={groupTitles[groupKey as keyof typeof groupTitles] || groupKey}
          guests={groupGuests}
          onUpdateGuest={onUpdateGuest}
          onDeleteGuest={onDeleteGuest}
          onSendInvitation={onSendInvitation}
          viewMode={viewMode}
          showStats={showStats}
        />
      ))}
    </div>
  );
}