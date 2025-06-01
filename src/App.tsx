// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Home from './pages/Home';
import SimCreateForm from './pages/SimCreateForm';

import Auth from './pages/Auth';
import AuthWrapper from './pages/AuthWrapper';
import SignupForm from './components/auth/SignupForm';
import LoginForm from './components/auth/LoginForm';
import UpdatePassword from './components/auth/UpdatePassword';
import ResetPassword from './components/auth/ResetPassword';

import TreePage from './pages/TreePage';

import Header from './components/Header';
import Footer from './components/Footer';
import CharacterList from './components/CharacterList';
import LoadingComponent from './components/LoadingComponent';
import Instruction from './pages/Instruction';
import AdminPage from './pages/AdminPage';
import CreateArticlePage from './pages/CreateArticle';
import BlogPage from './pages/Blog';
import ArticlePage from './pages/ArticlePage';

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
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/instruction" element={<Instruction />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/article/:id" element={
          <ProtectedRoute>
            <ArticlePage />
          </ProtectedRoute>
        } />
        <Route path="/createarticle" element={
          <ProtectedRoute>
            <CreateArticlePage />
          </ProtectedRoute>
        } />
        <Route path="/tree" element={
          <ProtectedRoute>
            <TreePage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <AuthWrapper />
          </ProtectedRoute>
        } />
        <Route
          path="/simcreateform"
          element={
            <ProtectedRoute>
              <SimCreateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list"
          element={
            <ProtectedRoute>
              <CharacterList />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
