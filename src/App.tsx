// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import SimCreateForm from './pages/SimCreateForm';

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Главная</Link>
        <Link to="/family-tree">Семейное дерево</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simcreateform" element={<SimCreateForm />} />
      </Routes>
    </Router>
  );
};

export default App;
