import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';

const MyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [favoriteFilter, setFavoriteFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['Personal', 'Study', 'Work', 'Important', 'Ideas', 'General'];

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  };

  const handleToggleFavorite = (noteId) => {
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        return { ...note, favorite: !note.favorite };
      }
      return note;
    });
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const filteredAndSortedNotes = () => {
    let filtered = notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory = categoryFilter === 'all' || note.category === categoryFilter;

      const matchesFavorite = favoriteFilter === 'all' ||
                            (favoriteFilter === 'favorited' && note.favorite) ||
                            (favoriteFilter === 'not-favorited' && !note.favorite);

      return matchesSearch && matchesCategory && matchesFavorite;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'updated':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const displayNotes = filteredAndSortedNotes();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
            <p className="text-gray-600 mt-1">Manage and organize your notes</p>
          </div>
          <Link
            to="/create"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            + Create New Note
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-4">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search notes by title, content, or tags..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Favorite Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favorite Status
              </label>
              <select
                value={favoriteFilter}
                onChange={(e) => setFavoriteFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Notes</option>
                <option value="favorited">Favorited</option>
                <option value="not-favorited">Not Favorited</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="updated">Recently Updated</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {displayNotes.length > 0 ? (
          <>
            <p className="text-gray-600 mb-4">
              Showing {displayNotes.length} of {notes.length} notes
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            message={
              searchQuery || categoryFilter !== 'all' || favoriteFilter !== 'all'
                ? 'No notes match your filters'
                : 'No notes yet. Create your first note!'
            }
            icon="📝"
            actionLink="/create"
            actionText="Create Note"
          />
        )}
      </div>
    </div>
  );
};

export default MyNotes;
