import React from 'react';
import { Link } from 'react-router-dom';

const MeetingCard = ({ meeting, onEdit, onDelete, showActions = true }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      onDelete(meeting.id);
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

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const isUpcoming = new Date(meeting.date) >= new Date();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800">
          {meeting.title}
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm ${
          isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
        }`}>
          {isUpcoming ? 'Upcoming' : 'Completed'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <span className="mr-2">📅</span>
          <span>{formatDate(meeting.date)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="mr-2">⏰</span>
          <span>{formatTime(meeting.time)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="mr-2">📍</span>
          <span>{meeting.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="mr-2">👥</span>
          <span>{meeting.memberCount} members</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Purpose:</p>
        <p className="text-gray-700">{meeting.purpose}</p>
      </div>

      {meeting.members && meeting.members.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Members:</p>
          <div className="flex flex-wrap gap-2">
            {meeting.members.map((member, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
              >
                {member}
              </span>
            ))}
          </div>
        </div>
      )}

      {meeting.notes && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Additional Notes:</p>
          <p className="text-gray-700 text-sm">{meeting.notes}</p>
        </div>
      )}

      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Link
            to={`/meetings/edit/${meeting.id}`}
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

export default MeetingCard;
