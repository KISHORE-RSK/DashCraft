import React, { useState } from 'react';
import Login from './components/Login';
import Dropzone from './components/Dropzone';
import Dashboard from './components/Dashboard';
import { LogOut, LayoutDashboard } from 'lucide-react';

function App() {
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setData(null);
  };

  const handleUploadSuccess = (uploadedData) => {
    setData(uploadedData);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/20 p-2 rounded-xl border border-blue-500/30">
                <LayoutDashboard className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">AnalyticsPro</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-xl transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-400">Upload your data to visualize the metrics and generate reports.</p>
        </div>

        <Dropzone onUploadSuccess={handleUploadSuccess} />
        <Dashboard data={data} />
      </main>
    </div>
  );
}

export default App;
