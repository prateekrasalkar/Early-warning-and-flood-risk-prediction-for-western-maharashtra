import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IntroPage from './IntroPage';
import FloodPrediction from './FloodPrediction';
import DetailsPage from './DetailsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/predict" element={<FloodPrediction />} />
        <Route path="/DetailsPage" element={<DetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
