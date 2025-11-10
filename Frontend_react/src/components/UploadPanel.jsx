import React, { useState, useCallback } from 'react';
import { IconButton, copyToClipboard } from '../App'; // FIX: Path corrected to reference the main App file

/**
 * 2. UploadPanel: Handles file selection, upload simulation, and link generation display.
 * Now reflects the true network state from the parent App component.
 */
const UploadPanel = ({ onFileSelect, onBack, link, code, isUploading }) => {
  const [file, setFile] = useState(null);

  const isLinkGenerated = !!link;

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Immediately call the upload handler in App.jsx
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  const handleCopy = useCallback((text) => {
    if (copyToClipboard(text)) {
        // NOTE: Using a simple JS alert for MVP, as requested, instead of a custom modal.
        alert("Copied to clipboard!"); 
        // onLinkCopied(); // Optional: uncomment if you want to transition back to landing after copy
    }
  }, []);


  // State 1: Before file selection
  const renderFileInput = () => (
    <div className="flex flex-col items-center space-y-6 w-full">
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading || isLinkGenerated}
      />  
      <label
        htmlFor="fileInput"
        className={`file-input-label ${isUploading || isLinkGenerated ? 'file-input-label-disabled' : ''}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0L9 13m3-3v8" /></svg>
        <p className="font-medium text-lg">Drag & drop or Click to select file</p>
      </label>
    </div>
  );

  // State 2: Uploading
  const renderUploading = () => (
    <div className="w-full space-y-4 p-4 text-center">
      <div className="text-xl font-semibold text-gray-700 truncate">{file?.name || 'Uploading...'}</div>
      <div className="mt-4 space-y-2">

        <svg className="animate-spin mx-auto h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>

        <p className="font-semibold text-indigo-600">Securing your file...</p>

        <p className="text-sm text-gray-500">Please wait, this may take a moment.</p>

      </div>

    </div>

  );

  // State 3: Link Generated
  const renderLinkDisplay = () => (
    <div className="w-full space-y-6 p-4">
      <h3 className="text-2xl font-bold" style={{color: 'var(--color-green-600)'}}>Upload Complete!</h3>
      <p className="text-gray-600">Share these securely generated links with anyone:</p>
      
      <div className="flex flex-col space-y-4">
        {/* Direct Link */}
        <div className="link-display-box">
          <span className="link-text-mono">{link}</span>
          <IconButton onClick={() => handleCopy(link)} color="indigo" className="ml-4 flex-shrink-0 !p-2 text-xs">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2m-2 2v1M8 9h10V7h-2M8 9h-2V7h2" /></svg>
          </IconButton>
        </div>
        
        {/* Short Code */}
        <div className="link-display-box">
          <span className="code-text-mono">{code}</span>
          <IconButton onClick={() => handleCopy(code)} color="purple" className="ml-4 flex-shrink-0 !p-2 text-xs">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2m-2 2v1M8 9h10V7h-2M8 9h-2V7h2" /></svg>
          </IconButton>
        </div>
      </div>
      
      <IconButton onClick={onBack} color="gray">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
         Done / New Upload
      </IconButton>
    </div>
  );

  const renderCurrentView = () => {
    if (isLinkGenerated) return renderLinkDisplay();
    if (isUploading) return renderUploading();
    return renderFileInput();
  };

  return (
    <div className="flex flex-col items-center w-full h-full max-w-lg mx-auto">
      <div className="flex justify-between w-full mb-4 items-center">
        <h2 className="text-2xl font-bold text-gray-800"style={{color:'#fff'}}>Upload Document</h2>
        <IconButton onClick={onBack} color="red" className="!p-2">
            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '1.5rem', height: '1.5rem', display: 'block' }} fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </IconButton>
      </div>

      <div className="w-full p-4 bg-white rounded-xl shadow-inner border" style={{ marginTop: '20px' }}>

      {renderCurrentView()}
      </div>  
    </div>
  );
};

export default UploadPanel;
