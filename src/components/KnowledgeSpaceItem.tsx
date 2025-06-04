import React from 'react';
import { KnowledgeSpace } from '../types';

interface KnowledgeSpaceItemProps {
  space: KnowledgeSpace;
  isSelected: boolean;
  onSelect: () => void;
}

const KnowledgeSpaceItem: React.FC<KnowledgeSpaceItemProps> = ({ 
  space, 
  isSelected, 
  onSelect 
}) => {
  const getCategoryIcon = (category: KnowledgeSpace['category']) => {
    switch (category) {
      case 'clinical':
        return '🩺';
      case 'research':
        return '🔬';
      case 'administrative':
        return '📋';
      case 'educational':
        return '📚';
      default:
        return '📁';
    }
  };
  
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-lg text-left transition-all ${
        isSelected 
          ? 'bg-white shadow-md border-2 border-blue-500' 
          : 'bg-white hover:shadow-sm border border-gray-200'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
          style={{ backgroundColor: `${space.color}20` }}
        >
          {getCategoryIcon(space.category)}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{space.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{space.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {space.itemCount} items
            </span>
            <span className="text-xs text-gray-400">
              {new Date(space.lastAccessed).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default KnowledgeSpaceItem;