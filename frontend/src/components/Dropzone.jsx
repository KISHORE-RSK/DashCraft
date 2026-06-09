import React, { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle } from 'lucide-react';

export default function Dropzone({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      onUploadSuccess(data);
    } catch (err) {
      setError('Failed to upload and process the file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div
        className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl transition-all duration-300 shadow-md ${
          dragActive
            ? 'border-olive-500 bg-olive-50/50 scale-[1.01]'
            : 'border-coffee-300 bg-white hover:bg-coffee-50/50 hover:border-coffee-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/json"
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center justify-center space-y-5">
          <div className={`p-5 rounded-2xl transition-colors duration-200 ${dragActive ? 'bg-olive-100/50' : 'bg-coffee-100'}`}>
            <UploadCloud className={`h-12 w-12 ${dragActive ? 'text-olive-600' : 'text-coffee-500'}`} />
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-bold text-coffee-900 mb-1.5">
              {uploading ? 'Processing File...' : 'Upload your data'}
            </h3>
            <p className="text-sm text-coffee-600 mb-5">
              Drag and drop your CSV, Excel, or JSON files here
            </p>
            <button
              onClick={onButtonClick}
              disabled={uploading}
              className="inline-flex items-center px-5 py-2.5 bg-olive-800 hover:bg-olive-900 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-xs disabled:opacity-50"
            >
              <File className="h-4 w-4 mr-2" />
              Browse Files
            </button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 flex items-center p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
          {error}
        </div>
      )}
    </div>
  );
}

