import { useEffect, useState } from 'react';

export function useUnsavedChanges(isModified) {
  const [showPrompt, setShowPrompt] = useState(false);
  
  useEffect(() => {
    // Function to handle beforeunload event
    const handleBeforeUnload = (event) => {
      if (isModified) {
        // Standard message for modern browsers
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        event.returnValue = message;
        setShowPrompt(true);
        return message;
      }
    };
    
    // Add event listener
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isModified]);
  
  // Return showPrompt state to be used in component
  return showPrompt;
}