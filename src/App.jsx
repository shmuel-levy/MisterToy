import { useState, useEffect } from 'react'
import { AppHeader } from './cmps/AppHeader' 
import { AppFooter } from './cmps/AppFooter'
import { Home } from './pages/Home'
import { ToyIndex } from './pages/ToyIndex'
import { ToyDetails } from './pages/ToyDetails'
import { ToyEdit } from './pages/ToyEdit'
import { LoginSignup } from './cmps/LoginSignup' 
import { About } from './pages/About'
import { Dashboard } from './pages/Dashboard'
import { ChatButton } from './cmps/ChatButton'
import { UserMsg } from './cmps/UserMsg'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { eventBus } from './services/event-bus.service'
import { userService } from './services/user/user.service.remote' 
import { ReviewExplore } from './pages/ReviewExplore.jsx'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedToyId, setSelectedToyId] = useState(null)
  const [userMsg, setUserMsg] = useState(null)
  const isOnline = useOnlineStatus()
  const [user, setUser] = useState(userService.getLoggedinUser()) 
  
  useEffect(() => {
    const unsubscribe = eventBus.on('show-user-msg', (msg) => {
      setUserMsg(msg)
    })
    
    return () => {
      unsubscribe()
    }
  }, [])
  
  function onSetPage(page) {
    setCurrentPage(page)
  }
  
  function onSelectToy(toyId) {
    setSelectedToyId(toyId)
    setCurrentPage('toyDetails')
  }
  
  function onAddToy() {
    if (!user) {
      eventBus.emit('show-user-msg', { 
        txt: 'Please login to add toys', 
        type: 'error' 
      })
      setCurrentPage('login')
      return
    }
    
    if (!user.isAdmin) {
      eventBus.emit('show-user-msg', { 
        txt: 'Only admins can add toys', 
        type: 'error' 
      })
      return
    }
    
    setSelectedToyId(null)
    setCurrentPage('toyEdit')
  }
  
  function onEditToy(toyId) {
    if (!user) {
      eventBus.emit('show-user-msg', { 
        txt: 'Please login to edit toys', 
        type: 'error' 
      })
      setCurrentPage('login')
      return
    }
    
    if (!user.isAdmin) {
      eventBus.emit('show-user-msg', { 
        txt: 'Only admins can edit toys', 
        type: 'error' 
      })
      return
    }
    
    setSelectedToyId(toyId)
    setCurrentPage('toyEdit')
  }
  
  function onBackToToys() {
    setCurrentPage('toys')
  }
  
  function onSaveToy(savedToy) {
    setCurrentPage('toys')
  }
  
  function closeUserMsg() {
    setUserMsg(null)
  }
  
  function onLogin(loggedInUser) {
    setUser(loggedInUser)
    setCurrentPage('home')
    eventBus.emit('show-user-msg', { 
      txt: `Welcome ${loggedInUser.fullname}!`, 
      type: 'success' 
    })
  }
  
  async function onLogout() {
    try {
      await userService.logout()
      setUser(null)
      eventBus.emit('show-user-msg', { 
        txt: 'Logged out successfully', 
        type: 'success' 
      })
    } catch (err) {
      console.error('Failed to logout', err)
      eventBus.emit('show-user-msg', { 
        txt: 'Failed to logout', 
        type: 'error' 
      })
    }
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
      
      <AppHeader 
        onSetPage={onSetPage} 
        currentPage={currentPage} 
        user={user} 
        onLogout={onLogout} 
      />
      
      <main className="main-layout">
        {currentPage === 'home' && <Home onSetPage={onSetPage} />}
{currentPage === 'reviews' && <ReviewExplore />}

        {currentPage === 'toys' && (
          <ToyIndex
            onSelectToy={onSelectToy}
            onAddToy={onAddToy}
            user={user}
          />
        )}
        {currentPage === 'toyDetails' && (
          <ToyDetails
            toyId={selectedToyId}
            onBack={onBackToToys}
            onEdit={() => onEditToy(selectedToyId)}
            user={user}
          />
        )}
        {currentPage === 'toyEdit' && (
          <ToyEdit
            toyId={selectedToyId}
            onSaveToy={onSaveToy}
            onCancel={onBackToToys}
          />
        )}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'about' && <About />}
        {currentPage === 'login' && (
          <LoginSignup onLogin={onLogin} />
        )}
      </main>
      
      <AppFooter />
      
      <ChatButton />
    </div>
  )
}

export default App