import { useState } from 'react';
import { AppHeader } from './cmps/AppHeader';
import { AppFooter } from './cmps/AppFooter';
import { Home } from './pages/Home';
import { ToyIndex } from './pages/ToyIndex';
import { About } from './pages/About';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  function onSetPage(page) {
    setCurrentPage(page);
  }

  return (
    <div className="app">
      <AppHeader onSetPage={onSetPage} currentPage={currentPage} />
      <main className="main-layout">
        {currentPage === 'home' && <Home />}
        {currentPage === 'toys' && <ToyIndex />}
        {currentPage === 'about' && <About />}
      </main>
      <AppFooter />
    </div>
  );
}

export default App;