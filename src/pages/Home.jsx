import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import NoteCard from '../components/NoteCard';
import MeetingCard from '../components/MeetingCard';
import EmptyState from '../components/EmptyState';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadNotes();
    loadMeetings();
  }, []);

  const loadNotes = () => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  };

  const loadMeetings = () => {
    const savedMeetings = localStorage.getItem('meetings');
    if (savedMeetings) {
      setMeetings(JSON.parse(savedMeetings));
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

  const handleDeleteMeeting = (meetingId) => {
    const updatedMeetings = meetings.filter(meeting => meeting.id !== meetingId);
    setMeetings(updatedMeetings);
    localStorage.setItem('meetings', JSON.stringify(updatedMeetings));
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentNotes = filteredNotes
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const upcomingMeetings = meetings
    .filter(meeting => new Date(meeting.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const favoriteNotes = notes.filter(note => note.favorite);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to NoteNest</h1>
          <p className="text-lg opacity-90">Your personal notes and meeting management system</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Create Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link
            to="/create"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-center"
          >
            + Create New Note
          </Link>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <DashboardCard
            title="Total Notes"
            count={notes.length}
            icon="📝"
            color="blue"
          />
          <DashboardCard
            title="Favorites"
            count={favoriteNotes.length}
            icon="⭐"
            color="yellow"
          />
          <DashboardCard
            title="Meetings"
            count={meetings.length}
            icon="📅"
            color="purple"
          />
          <DashboardCard
            title="Upcoming"
            count={upcomingMeetings.length}
            icon="🔔"
            color="green"
          />
        </div>

        {/* Recent Notes Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Notes</h2>
            <Link to="/notes" className="text-blue-500 hover:text-blue-600 font-medium">
              View All →
            </Link>
          </div>
          {recentNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              message="No notes yet. Create your first note!"
              icon="📝"
              actionLink="/create"
              actionText="Create Note"
            />
          )}
        </div>

        {/* Upcoming Meetings Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Upcoming Meetings</h2>
            <Link to="/meetings" className="text-blue-500 hover:text-blue-600 font-medium">
              View All →
            </Link>
          </div>
          {upcomingMeetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMeetings.map(meeting => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onDelete={handleDeleteMeeting}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              message="No upcoming meetings scheduled."
              icon="📅"
              actionLink="/meetings"
              actionText="Schedule Meeting"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
