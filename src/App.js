import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyNotes from './pages/MyNotes';
import CreateNote from './pages/CreateNote';
import EditNote from './pages/EditNote';
import Favorites from './pages/Favorites';
import Meetings from './pages/Meetings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<MyNotes />} />
          <Route path="/create" element={<CreateNote />} />
          <Route path="/edit/:id" element={<EditNote />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/meetings" element={<Meetings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
