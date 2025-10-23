import React from 'react';

export interface Enquiry {
  id: string;
  title: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface EnquiryKanbanProps {
  enquiries: Enquiry[];
  onStatusChange: (enquiryId: string, newStatus: Enquiry['status']) => void;
  className?: string;
}

const statusConfig = {
  new: { label: 'New', color: 'bg-gray-100 text-gray-800' },
  contacted: { label: 'Contacted', color: 'bg-blue-100 text-blue-800' },
  qualified: { label: 'Qualified', color: 'bg-yellow-100 text-yellow-800' },
  proposal: { label: 'Proposal', color: 'bg-purple-100 text-purple-800' },
  closed: { label: 'Closed', color: 'bg-green-100 text-green-800' },
};

const priorityConfig = {
  low: 'bg-gray-200',
  medium: 'bg-yellow-200',
  high: 'bg-red-200',
};

export function EnquiryKanban({
  enquiries,
  onStatusChange,
  className = '',
}: EnquiryKanbanProps) {
  const groupedEnquiries = enquiries.reduce((acc, enquiry) => {
    if (!acc[enquiry.status]) {
      acc[enquiry.status] = [];
    }
    acc[enquiry.status].push(enquiry);
    return acc;
  }, {} as Record<Enquiry['status'], Enquiry[]>);

  return (
    <div className={`flex space-x-4 overflow-x-auto ${className}`}>
      {Object.entries(statusConfig).map(([status, config]) => {
        const statusEnquiries = groupedEnquiries[status as Enquiry['status']] || [];
        
        return (
          <div key={status} className="flex-shrink-0 w-64">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                {config.label} ({statusEnquiries.length})
              </h3>
              
              <div className="space-y-3">
                {statusEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      const statuses = Object.keys(statusConfig) as Enquiry['status'][];
                      const currentIndex = statuses.indexOf(enquiry.status);
                      const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                      onStatusChange(enquiry.id, nextStatus);
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {enquiry.title}
                      </h4>
                      <div
                        className={`w-3 h-3 rounded-full ${priorityConfig[enquiry.priority]}`}
                        title={enquiry.priority}
                      />
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {enquiry.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}