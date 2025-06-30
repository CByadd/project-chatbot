import React from 'react';
import * as Icons from 'lucide-react';
import { componentItems } from '../data/components';

const ComponentPanel = ({ onDragStart, onClose }) => {
  const renderIcon = (iconName, className = '') => {
    const Icon = Icons[iconName];
    return Icon ? <Icon size={16} className={className} /> : <Icons.Circle size={16} className={className} />;
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100 flex-shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Components</h2>
          <p className="text-xs text-gray-500 mt-1">Drag to add to canvas</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icons.X size={20} className="text-gray-600" />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {componentItems.map((component) => (
            <div
              key={component.id}
              draggable
              onDragStart={(event) => onDragStart(event, component.type)}
              className={`flex items-center p-3 rounded-lg border cursor-move hover:shadow-sm transition-all duration-200 ${component.color} hover:scale-[1.02] active:scale-95 touch-manipulation`}
            >
              <div className="mr-3 flex-shrink-0">
                {renderIcon(component.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-gray-900 truncate">{component.label}</h3>
                <p className="text-xs text-gray-600 truncate">{component.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComponentPanel;