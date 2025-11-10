import React, { useState, useCallback } from 'react';
import { IconButton } from '../App'; // FIX: Path corrected to reference the main App file

/**
 * 3. RetrievePanel: Handles code input and shows the download link.
 */
const RetrievePanel = ({ onCodeSubmit, onBack, isRetrieving, downloadLink }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);

  const isFileRetrieved = !!downloadLink;
  const isButtonDisabled = isRetrieving || isFileRetrieved;

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setError(null);
    if (!code.trim()) {
      setError('Please enter a share code.');
      return;
    }
    // Call the mock handler in App.jsx
    onCodeSubmit(code);
    setCode('');
  }, [code, onCodeSubmit]);
  
  // State 1: Input Form
  const renderInputForm = () => (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-2">
        <label htmlFor="shareCode" className="text-lg font-medium text-gray-700" style={{color:'#fff'}}>Enter Share Code:</label>
        <input
          id="shareCode"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g., XYZABC"
          className="input-field"
          style={{fontFamily: 'monospace'}}
          disabled={isRetrieving}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <IconButton type="submit" color="purple" disabled={isRetrieving}>
        {isRetrieving ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Checking Code...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Retrieve File
          </>
        )}
      </IconButton>
    </form>
  );

  // State 2: Download Link Display
  const renderDownloadDisplay = () => (
    <div className="w-full space-y-4 p-4 text-center">
      <h3 className="text-2xl font-bold" style={{color: 'var(--color-green-600)'}}>File Found!</h3>
      <p className="text-gray-600">Click below to start your secure download:</p>
      
      <a 
        href={downloadLink} 
        target="_blank" 
        rel="noopener noreferrer"
        download // Added for direct download capability
        className="icon-button w-full p-4 font-extrabold text-xl"
        style={{backgroundColor: 'var(--color-purple-600)'}}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2v-4a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2z" /></svg>
        Download File Now
      </a>
      
      <IconButton onClick={onBack} color="gray" className="w-full">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
         New Search
      </IconButton>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full h-full max-w-lg mx-auto">
      <div className="flex justify-between w-full mb-4 items-center">
        <h2 className="text-2xl font-bold text-gray-800" style={{color:'#fff'}}>Retrieve Document</h2>
        <IconButton onClick={onBack} color="red" className="!p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </IconButton>
      </div>
      <div className="w-full p-4 bg-white rounded-xl shadow-inner border">
        {isFileRetrieved ? renderDownloadDisplay() : renderInputForm()}
      </div>
    </div>
  );
};

export default RetrievePanel;
