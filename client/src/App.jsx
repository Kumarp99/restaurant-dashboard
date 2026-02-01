import React, { useState } from 'react';
import MenuManagement from './pages/MenuManagement';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  const [view, setView] = useState('menu'); 

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white fixed h-full shadow-xl">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-wide">RestoAdmin</h1>
          <p className="text-slate-400 text-xs mt-1">Dashboard v1.0</p>
        </div>
        <nav className="mt-6">
          <button 
            onClick={() => setView('menu')}
            className={`block w-full text-left px-6 py-3 transition-colors duration-200 ${view === 'menu' ? 'bg-slate-700 border-r-4 border-blue-500' : 'hover:bg-slate-700'}`}
          >
            📦 Menu Items
          </button>
          <button 
            onClick={() => setView('dashboard')}
            className={`block w-full text-left px-6 py-3 transition-colors duration-200 ${view === 'dashboard' ? 'bg-slate-700 border-r-4 border-blue-500' : 'hover:bg-slate-700'}`}
          >
            📊 Dashboard & Analytics
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {view === 'menu' ? <MenuManagement /> : <Dashboard />}
      </main>
    </div>
  );
}

export default App;