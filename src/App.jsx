import { useState, useEffect } from 'react';
import { AppHeader } from './cmps/AppHeader';
import { AppFooter } from './cmps/AppFooter';
import { Home } from './pages/Home';
import { ToyIndex } from './pages/ToyIndex';
import { ToyDetails } from './pages/ToyDetails';
import { ToyEdit } from './pages/ToyEdit';
import { About } from './pages/About';
import { Dashboard } from './pages/Dashboard'
import { ChatButton } from './cmps/ChatButton';
import { UserMsg } from './cmps/UserMsg';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { eventBus } from './services/event-bus.service';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedToyId, setSelectedToyId] = useState(null);
  const [userMsg, setUserMsg] = useState(null);
  const isOnline = useOnlineStatus();
  
  useEffect(() => {
  
    const unsubscribe = eventBus.on('show-user-msg', (msg) => {
      setUserMsg(msg);
    });
    
    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);
  
  function onSetPage(page) {
    setCurrentPage(page);
  }
  
  function onSelectToy(toyId) {
    setSelectedToyId(toyId);
    setCurrentPage('toyDetails');
  }
  
  function onAddToy() {
    setSelectedToyId(null);
    setCurrentPage('toyEdit');
  }
  
  function onEditToy(toyId) {
    setSelectedToyId(toyId);
    setCurrentPage('toyEdit');
  }
  
  function onBackToToys() {
    setCurrentPage('toys');
  }
  
  function onSaveToy(savedToy) {
    setCurrentPage('toys');
  }
  
  function closeUserMsg() {
    setUserMsg(null);
  }
  
  return (
    <div className="app">
      {!isOnline && (
        <div className="offline-alert">
          You are currently offline. Some features may be unavailable.
        </div>
      )}
      
      {userMsg && (
        <UserMsg msg={userMsg} onClose={closeUserMsg} />
      )}
      
      <AppHeader onSetPage={onSetPage} currentPage={currentPage} />
      <main className="main-layout">
        {currentPage === 'home' && <Home />}
        {currentPage === 'toys' && (
          <ToyIndex 
            onSelectToy={onSelectToy}
            onAddToy={onAddToy}
          />
        )}
        {currentPage === 'toyDetails' && (
          <ToyDetails 
            toyId={selectedToyId}
            onBack={onBackToToys}
            onEdit={() => onEditToy(selectedToyId)}
          />
        )}
        {currentPage === 'toyEdit' && (
          <ToyEdit 
            toyId={selectedToyId}
            onSaveToy={onSaveToy}
            onCancel={onBackToToys}
          />
        )}
        {currentPage === 'dashboard' && <Dashboard />} {/* Add this line */}
        {currentPage === 'about' && <About />}
      </main>
      <AppFooter />
      
      <ChatButton />
    </div>
  );
}

export default App;