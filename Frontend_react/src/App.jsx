import React, { useState, useCallback } from 'react';
// FIX: Added the file extension (.css) to resolve the stylesheet import
import './styles.css';
// FIX: Added the file extensions (.jsx) to resolve component imports
import LandingPage from './components/LandingPage.jsx';
import UploadPanel from './components/UploadPanel.jsx';
import RetrievePanel from './components/RetrievePanel.jsx';

const API_URL = import.meta.env.VITE_API_URL ?? ''; // Your Flask backend URL

// --- Shared Helper Functions and Components ---

/**
 * 1. Helper function to copy text to the clipboard.
 * (Needed by UploadPanel)
*/

export const copyToClipboard = (text) => {
    try {
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy'); // Fallback command
        document.body.removeChild(tempInput);
        return true;
    } catch (err) {
        console.error('Could not copy text: ', err);
        return false;
    }

};

/**

 * 2. Shared Button Component (Used by all panels for consistent styling)

 * (Exported so other components can import it: import { IconButton } from './App.jsx';)

*/

export const IconButton = ({ onClick, color, children, type = 'button', disabled = false, className = '' }) => {
    let baseStyle = 'icon-button';
    if (color === 'green') baseStyle += ' btn-green';
    else if (color === 'purple') baseStyle += ' btn-purple';
    else if (color === 'red') baseStyle += ' btn-red';
    else if (color === 'indigo') baseStyle += ' btn-indigo';
    else if (color === 'gray') baseStyle += ' btn-gray';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${className}`}
        >
            {children}
        </button>
    );
};

// --- Main Application Component ---

const App = () => {

    // Defines the current state (which screen is active)
    const [appState, setAppState] = useState('landing');

    // State for API data results
    const [generatedLink, setGeneratedLink] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [retrievedFileLink, setRetrievedFileLink] = useState('');
    const [isFetching, setIsFetching] = useState(false); // To handle loading state for API calls

    // --- State Handlers for Transitions ---
    const handleUploadClick = useCallback(() => setAppState('uploading'), []);
    const handleRetrieveClick = useCallback(() => setAppState('retrieving'), []);

    // Transition back to the main landing page, clearing results
    const handleBackToLanding = useCallback(() => {
        setAppState('landing');
        setGeneratedLink('');
        setGeneratedCode('');
        setRetrievedFileLink('');
        setIsFetching(false);
    }, []);

    // --- Live API Handlers ---

    const handleFileUpload = useCallback(async (file) => {
        console.log("Uploading file:", file.name);
        setIsFetching(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();
            setGeneratedLink(data.link);
            setGeneratedCode(data.code);
            setAppState('link_generated');

        } catch (error) {
            console.error('Upload Error:', error);
            alert(`Upload Error: Service Offine`); //alert(`Error: ${error.message}`);

            // Go back to upload screen on error
            setAppState('uploading');
        } finally {
            setIsFetching(false);
        }
    }, []);

    const handleCodeRetrieval = useCallback(async (code) => {
        console.log("Retrieving with code:", code);
        setIsFetching(true);
        
        try {
            // First, check if the code is valid to provide better UX

            const checkResponse = await fetch(`${API_URL}/check/${code}`);
            if (!checkResponse.ok) {

                const errorData = await checkResponse.json();
                throw new Error(errorData.error || `Share code '${code}' not found.`);

            }

            // If the code is valid, set the direct download link for the user to click
            setRetrievedFileLink(`${API_URL}/retrieve/${code}`);
            setAppState('file_retrieved');

        } catch (error) {

            console.error('Retrieval Error:', error);
            alert(`Error: ${error.message}`);
            setAppState('retrieving'); // Stay on retrieve panel

        } finally {

            setIsFetching(false);
        }
    }, []);

    // --- Content Renderer (The Main Router) ---

    const renderContent = () => {
        // Use a switch case to determine which panel to render
        switch (appState) {
            case 'landing':
                return (
                    <LandingPage 
                        onUploadClick={handleUploadClick} 
                        onRetrieveClick={handleRetrieveClick}
                    />
                );

            case 'uploading':
            case 'link_generated':
                return (
                    <UploadPanel
                        onFileSelect={handleFileUpload}
                        onBack={handleBackToLanding}
                        link={generatedLink}
                        code={generatedCode}
                        isUploading={isFetching}
                    />
                );

            case 'retrieving':
            case 'file_retrieved':
                return (
                    <RetrievePanel
                        onCodeSubmit={handleCodeRetrieval}
                        onBack={handleBackToLanding}
                        isRetrieving={isFetching}
                        downloadLink={retrievedFileLink}
                    />
                );
            
            default:
                return null;
        }
    };

    // Determine the active panel class for CSS transitions
    const getPanelClass = (state) => {
        if (state === appState || (state === 'uploading' && appState === 'link_generated') || (state === 'retrieving' && appState === 'file_retrieved')) {
            return 'panel-active';
        }
        return '';
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>TempDrive</h1>
                <p>Temporary Online Storage</p>
            </header>

            <main className="main-content">
                    {renderContent()}    
            </main>

            <footer className="app-footer">
                <p>  
                    TempDrive | Temporary Cloud Storage<br></br>
                    Made by Gurshaan Tiwana<br></br>
                    The site is for non-commercial purposes only.<br></br>
                    Anything to say? Mail me at gurshaan@tiwanas.me (no ads please)    
                </p>
            </footer>
        </div>
    );
};

export default App;
