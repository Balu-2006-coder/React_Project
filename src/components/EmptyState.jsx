import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ message, icon, actionLink, actionText }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-gray-500 text-lg text-center mb-6">{message}</p>
      {actionLink && actionText && (
        <Link
          to={actionLink}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
