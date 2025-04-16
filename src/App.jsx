import { AppHeader } from './cmps/AppHeader';
import { AppFooter } from './cmps/AppFooter';

function App() {
  return (
    <div className="app">
      <AppHeader />
      <main className="main-layout">
        <h1>Mister Toy App</h1>
        <p>Welcome to our toy store!</p>
      </main>
      <AppFooter />
    </div>
  );
}

export default App;