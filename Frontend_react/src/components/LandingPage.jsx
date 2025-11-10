import React from 'react';
import { IconButton } from '../App'; // FIX: Path corrected to reference the main App file

/**
 * 1. LandingPage: The initial view with Upload/Retrieve options.
 */
const LandingPage = React.memo(({ onUploadClick, onRetrieveClick }) => (
  <div className="flex flex-col items-center p-8 space-y-8 h-full w-full justify-center">
    <h2 className="text-3xl font-extrabold text-gray-800" style={{color:'#fff', marginBottom: '20px'}}>
      Simple, Secure File Sharing
    </h2>
    

    <div className="flex space-x-6" style={{ display: 'inline-flex', gap: '30px', alignItems: 'center' }}>
      <IconButton onClick={onUploadClick} color="green">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
        Upload File
      </IconButton>
      <IconButton onClick={onRetrieveClick} color="purple">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2v5a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6zM15 7v10m-3-3a3 3 0 00-3-3H9a3 3 0 00-3 3v2" /></svg>
        Retrieve File
      </IconButton>
    </div>
  </div>
));

export default LandingPage;