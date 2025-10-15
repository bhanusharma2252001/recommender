import React, { useContext } from 'react';
import Login from './components/Login';
import CoursesPage from './components/CoursesPage';
import Recommendations from './components/Recommendations';
import { AuthContext } from './context/AuthContext';

export default function App() {
  const { token } = useContext(AuthContext);

  return (
    <div className='app-shell'>
      <header className='topbar'>
        <h1 className='brand'>Recommender</h1>
      </header>

      <main className='main'>
        {!token ? (
          <Login />
        ) : (
          <div className='grid'>
            <section className='panel'>
              <CoursesPage />
            </section>
            <aside className='panel side'>
              <Recommendations />
            </aside>
          </div>
        )}
      </main>

      <footer className='footer'>
        <small>© Help Study Abroad — Demo</small>
      </footer>
    </div>
  );
}
