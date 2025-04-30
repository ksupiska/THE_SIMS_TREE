// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import SimCreateForm from './pages/SimCreateForm';

import Header from './components/Header';
import CharacterList from './components/CharacterList';

const App = () => {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simcreateform" element={<SimCreateForm />} />
        <Route path="/list" element={<CharacterList />} />
      </Routes>
    </Router>
  );
};

export default App;
