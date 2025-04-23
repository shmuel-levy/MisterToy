import { useEffect, useState } from 'react'

export function useUnsavedChanges(isModified) {
  const [showPrompt, setShowPrompt] = useState(false)
  
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isModified) {
        const message = 'You have unsaved changes. Are you sure you want to leave?'
        event.returnValue = message
        setShowPrompt(true)
        return message
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isModified])
  
  return showPrompt
}