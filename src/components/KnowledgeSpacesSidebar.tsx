import React from 'react';
import { User, Building2, FileText, ToggleLeft, ToggleRight } from 'lucide-react';
import { KnowledgeSpace } from '../types';

interface KnowledgeSpacesSidebarProps {
  personalSpaces: KnowledgeSpace[];
  organizationSpaces: KnowledgeSpace[];
  onToggleSpace?: (spaceId: string) => void;
}

const KnowledgeSpacesSidebar: React.FC<KnowledgeSpacesSidebarProps> = ({
  personalSpaces,
  organizationSpaces,
  onToggleSpace,
}) => {
  const SpaceItem = ({ space }: { space: KnowledgeSpace }) => (
    <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{space.title}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
            ${space.category === 'clinical' ? 'bg-blue-100 text-blue-700' : ''}
            ${space.category === 'research' ? 'bg-purple-100 text-purple-700' : ''}
            ${space.category === 'administrative' ? 'bg-green-100 text-green-700' : ''}
            ${space.category === 'educational' ? 'bg-yellow-100 text-yellow-700' : ''}
          `}>
            {space.category}
          </span>
          <span className="flex items-center text-xs text-gray-500">
            <FileText className="w-3 h-3 mr-1" />
            {space.documentCount}
          </span>
        </div>
      </div>
      <button
        onClick={() => onToggleSpace?.(space.id)}
        className="ml-2 p-1 rounded hover:bg-gray-100 transition-colors"
        aria-label={space.isActive ? 'Deactivate space' : 'Activate space'}
      >
        {space.isActive ? (
          <ToggleRight className="w-5 h-5 text-blue-600" />
        ) : (
          <ToggleLeft className="w-5 h-5 text-gray-400" />
        )}
      </button>
    </div>
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Knowledge Spaces</h2>
      </div>

      {/* Personal Spaces */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center mb-3">
            <User className="w-4 h-4 text-gray-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Personal</h3>
          </div>
          <div className="space-y-1">
            {personalSpaces.map((space) => (
              <SpaceItem key={space.id} space={space} />
            ))}
          </div>
        </div>

        {/* Organization Spaces */}
        <div className="p-4 pt-0">
          <div className="flex items-center mb-3">
            <Building2 className="w-4 h-4 text-gray-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Organization</h3>
          </div>
          <div className="space-y-1">
            {organizationSpaces.map((space) => (
              <SpaceItem key={space.id} space={space} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeSpacesSidebar;