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

  const handleBackToUpload = () => {
    setData(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 p-2 rounded-xl border border-blue-100">
                <LayoutDashboard className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">Student Analytics</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-xl transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-2 text-slate-500" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!data ? (
          <div>
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Upload Student Data</h1>
              <p className="text-slate-500 text-lg">
                Drag and drop your spreadsheet (.csv, .xlsx, .json) to generate the Student Performance profile.
              </p>
            </div>
            <Dropzone onUploadSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <Dashboard data={data} onBack={handleBackToUpload} />
        )}
      </main>
    </div>
  );
}

export default App;

