// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import SimCreateForm from './pages/SimCreateForm';

import Header from './components/Header';

const App = () => {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simcreateform" element={<SimCreateForm />} />
      </Routes>
    </Router>
  );
};

export default App;
