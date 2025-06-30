import React from 'react';
import * as Icons from 'lucide-react';
import { navigationItems } from '../data/navigation';

const Sidebar = ({ onToggleSidebar }) => {
  const renderIcon = (iconName) => {
    const Icon = Icons[iconName];
    return Icon ? <Icon size={20} /> : <Icons.Circle size={20} />;
  };

  const groupedItems = navigationItems.reduce((acc, item) => {
    const section = item.section || 'default';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {});

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">ConvoBox</h1>
        </div>
        
        {/* Close button for mobile */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icons.X size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section}>
            {section !== 'default' && (
              <div className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section}
              </div>
            )}
            <nav className="px-3 pb-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  className={`w-full flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-lg transition-colors ${
                    item.active
                      ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-500'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3">{renderIcon(item.icon)}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;