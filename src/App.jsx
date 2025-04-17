import { AppHeader } from './cmps/AppHeader';
import { AppFooter } from './cmps/AppFooter';
import { ToyIndex } from './pages/ToyIndex';

function App() {
  return (
    <div className="app">
      <AppHeader />
      <main className="main-layout">
        <ToyIndex />
      </main>
      <AppFooter />
    </div>
  );
}

export default App;