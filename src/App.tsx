import React from 'react';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import QuickActions from './components/QuickActions';

function App() {
  return (
    <div className="h-screen bg-garage-100 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Sidebar className="h-full" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          <ChatInterface className="h-full" />
        </div>

        {/* Right Panel - Quick Actions */}
        <div className="w-80 flex-shrink-0 p-4 overflow-y-auto">
          <QuickActions className="h-fit" />
        </div>
      </div>
    </div>
  );
}

export default App;