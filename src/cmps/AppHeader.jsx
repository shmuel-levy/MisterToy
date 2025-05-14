export function AppHeader({ onSetPage, currentPage, user, onLogout }) {
  return (
    <header className="app-header">
      <div className="header-content main-layout">
        <h1 className="logo">Mister Toy</h1>
        
        <nav className="main-nav">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault()
              onSetPage('home')
            }}
            className={currentPage === 'home' ? 'active' : ''}
          >
            Home
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault()
              onSetPage('toys')
            }}
            className={currentPage === 'toys' ? 'active' : ''}
          >
            Toys
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault()
              onSetPage('dashboard')
            }}
            className={currentPage === 'dashboard' ? 'active' : ''}
          >
            Dashboard
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault()
              onSetPage('about')
            }}
            className={currentPage === 'about' ? 'active' : ''}
          >
            About
          </a>
        </nav>
        
        <div className="user-actions">
          {user ? (
            <div className="user-info">
              <span>Hello, {user.fullname}</span>
              <button className="btn-logout" onClick={onLogout}>Logout</button>
            </div>
          ) : (
            <button 
              className="btn-login" 
              onClick={(e) => {
                e.preventDefault()
                onSetPage('login')
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  )
}