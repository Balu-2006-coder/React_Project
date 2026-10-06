import React from 'react';
import { Link } from 'react-router-dom';

const NoteCard = ({ note, onEdit, onDelete, onToggleFavorite, showActions = true }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <Link to={`/edit/${note.id}`} className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
            {note.title}
          </h3>
        </Link>
        {note.favorite && (
          <span className="text-yellow-500 text-2xl ml-2">⭐</span>
        )}
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">
        {note.content}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {note.category}
        </span>
        {note.tags && note.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <span>Created: {formatDate(note.createdAt)}</span>
        {note.updatedAt !== note.createdAt && (
          <span>Updated: {formatDate(note.updatedAt)}</span>
        )}
      </div>

      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onToggleFavorite(note.id)}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              note.favorite
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {note.favorite ? '★ Favorited' : '☆ Favorite'}
          </button>
          <Link
            to={`/edit/${note.id}`}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-center"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteCard;
