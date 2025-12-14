import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';
import './custom-styles.css';
import TablesPage from './pages/TablesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TablesPage />} />
        <Route path="/tables" element={<TablesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
