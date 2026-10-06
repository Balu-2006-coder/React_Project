import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';

const Favorites = () => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const favoriteNotes = notes.filter(note => note.favorite);

  const filteredNotes = favoriteNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">⭐ Favorites</h1>
            <p className="text-gray-600 mt-1">Your favorite and important notes</p>
          </div>
          <Link
            to="/create"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            + Create New Note
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search favorite notes..."
          />
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <>
            <p className="text-gray-600 mb-4">
              Showing {filteredNotes.length} favorite note{filteredNotes.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map(note => (
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
              searchQuery
                ? 'No favorite notes match your search'
                : favoriteNotes.length === 0
                ? 'No favorite notes yet. Mark some notes as favorite!'
                : 'No notes match your search'
            }
            icon="⭐"
            actionLink={favoriteNotes.length === 0 ? "/notes" : "/create"}
            actionText={favoriteNotes.length === 0 ? "Go to My Notes" : "Create Note"}
          />
        )}
      </div>
    </div>
  );
};

export default Favorites;
