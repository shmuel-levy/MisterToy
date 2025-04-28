export function AppHeader({ onSetPage, currentPage }) {
  return (
    <header className="app-header">
      <div className="header-content main-layout">
        <h1 className="logo">Mister Toy</h1>
        
        <nav className="main-nav">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onSetPage('home');
            }}
            className={currentPage === 'home' ? 'active' : ''}
          >
            Home
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onSetPage('toys');
            }}
            className={currentPage === 'toys' ? 'active' : ''}
          >
            Toys
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onSetPage('dashboard');
            }}
            className={currentPage === 'dashboard' ? 'active' : ''}
          >
            Dashboard
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onSetPage('about');
            }}
            className={currentPage === 'about' ? 'active' : ''}
          >
            About
          </a>
        </nav>
      </div>
    </header>
  );
}