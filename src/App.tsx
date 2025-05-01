// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Home from './pages/Home';
import SimCreateForm from './pages/SimCreateForm';
import Auth from './pages/Auth';

import Header from './components/Header';
import Footer from './components/Footer';
import CharacterList from './components/CharacterList';
import LoadingComponent from './components/LoadingComponent';

import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
const App = () => {
  const [loading, setLoading] = useState(true);

  // Эмуляция загрузки контента
  useEffect(() => {
    // Обычно здесь будет запрос к серверу или другая асинхронная логика
    const timer = setTimeout(() => {
      setLoading(false); // Убираем индикатор загрузки через 3 секунды
    }, 3000);

    // Очистка таймера, если компонент размонтирован
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading && <LoadingComponent />} {/* Показываем индикатор загрузки, если данные еще не загружены */}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/simcreateform"
          element={
            <ProtectedRoute>
              <SimCreateForm />
            </ProtectedRoute>
          }
        />
        <Route path="/list" element={<CharacterList />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
