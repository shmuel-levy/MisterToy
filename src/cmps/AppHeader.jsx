export function AppHeader({ onSetPage, currentPage }) {
  return (
    <header className="app-header">
      <div className="header-content main-layout">
        <div className="logo">
          <h1>MisterToy</h1>
        </div>
        <nav className="main-nav">
          <a 
            href="#" 
            className={currentPage === 'home' ? 'active' : ''} 
            onClick={() => onSetPage('home')}
          >
            Home
          </a>
          <a 
            href="#" 
            className={currentPage === 'toys' ? 'active' : ''} 
            onClick={() => onSetPage('toys')}
          >
            Toys
          </a>
          <a 
            href="#" 
            className={currentPage === 'about' ? 'active' : ''} 
            onClick={() => onSetPage('about')}
          >
            About
          </a>
        </nav>
      </div>
    </header>
  )
}