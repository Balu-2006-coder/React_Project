import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ setSearchQuery }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const location = useLocation();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (setSearchQuery) {
      setSearchQuery(value);
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'My Notes', path: '/notes' },
    { name: 'Create Note', path: '/create' },
    { name: 'Favorites', path: '/favorites' },
    { name: 'Meetings', path: '/meetings' },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-white font-bold text-2xl">
              📝 NoteNest
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-white/20 ${
                  location.pathname === item.path ? 'bg-white/20' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:block">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchInput}
              onChange={handleSearch}
              className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 w-48"
            />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 rounded-md hover:bg-white/20"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-white/20 ${
                    location.pathname === item.path ? 'bg-white/20' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <input
                type="text"
                placeholder="Search notes..."
                value={searchInput}
                onChange={handleSearch}
                className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 w-full"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
