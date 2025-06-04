import React from 'react';
import { KnowledgeSpace } from '../types';
import KnowledgeSpaceItem from './KnowledgeSpaceItem';

interface SidebarProps {
  knowledgeSpaces: KnowledgeSpace[];
  selectedSpaceId?: string;
  onSpaceSelect: (spaceId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  knowledgeSpaces, 
  selectedSpaceId, 
  onSpaceSelect 
}) => {
  return (
    <aside className="w-80 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Knowledge Spaces
        </h1>
        
        <div className="space-y-2">
          {knowledgeSpaces.map((space) => (
            <KnowledgeSpaceItem
              key={space.id}
              space={space}
              isSelected={space.id === selectedSpaceId}
              onSelect={() => onSpaceSelect(space.id)}
            />
          ))}
        </div>
        
        <button className="mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + New Space
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;