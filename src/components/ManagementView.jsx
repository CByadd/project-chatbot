import React from 'react';
import Sidebar from './Sidebar';
import BotManagement from './BotManagement';
import SimpleAxiosDemo from './SimpleAxiosDemo';

const ManagementView = ({ 
  sidebarOpen, 
  onToggleSidebar, 
  onCreateNew, 
  onEditBot 
}) => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out`}>
        <Sidebar onToggleSidebar={onToggleSidebar} />
      </div>
      
      <BotManagement 
        onCreateNew={onCreateNew}
        onEditBot={onEditBot}
        onToggleSidebar={onToggleSidebar}
      />

      {/* Simple Axios Demo Button */}
      <SimpleAxiosDemo />
    </div>
  );
};

export default ManagementView;