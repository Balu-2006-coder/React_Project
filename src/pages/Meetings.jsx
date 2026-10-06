import React, { useState, useEffect } from 'react';
import MeetingCard from '../components/MeetingCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    place: '',
    purpose: '',
    memberCount: '',
    members: '',
    location: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = () => {
    const savedMeetings = localStorage.getItem('meetings');
    if (savedMeetings) {
      setMeetings(JSON.parse(savedMeetings));
    }
  };

  const handleDeleteMeeting = (meetingId) => {
    const updatedMeetings = meetings.filter(meeting => meeting.id !== meetingId);
    setMeetings(updatedMeetings);
    localStorage.setItem('meetings', JSON.stringify(updatedMeetings));
  };

  const handleEditMeeting = (meeting) => {
    setEditingMeeting(meeting);
    setFormData({
      title: meeting.title,
      date: meeting.date,
      time: meeting.time,
      place: meeting.place,
      purpose: meeting.purpose,
      memberCount: meeting.memberCount,
      members: meeting.members ? meeting.members.join(', ') : '',
      location: meeting.location,
      notes: meeting.notes || '',
    });
    setShowCreateForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Meeting title is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    if (!formData.place.trim()) {
      newErrors.place = 'Place is required';
    }
    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const uniqueId = editingMeeting ? editingMeeting.id : Date.now().toString() + Math.random().toString(36).substr(2, 9);

    const membersArray = formData.members
      .split(',')
      .map(member => member.trim())
      .filter(member => member !== '');

    const meetingData = {
      id: uniqueId,
      title: formData.title.trim(),
      date: formData.date,
      time: formData.time,
      place: formData.place.trim(),
      purpose: formData.purpose.trim(),
      memberCount: parseInt(formData.memberCount) || membersArray.length,
      members: membersArray,
      location: formData.location.trim(),
      notes: formData.notes.trim(),
    };

    let updatedMeetings;
    if (editingMeeting) {
      updatedMeetings = meetings.map(meeting =>
        meeting.id === editingMeeting.id ? meetingData : meeting
      );
    } else {
      updatedMeetings = [...meetings, meetingData];
    }

    setMeetings(updatedMeetings);
    localStorage.setItem('meetings', JSON.stringify(updatedMeetings));

    // Reset form
    setFormData({
      title: '',
      date: '',
      time: '',
      place: '',
      purpose: '',
      memberCount: '',
      members: '',
      location: '',
      notes: '',
    });
    setEditingMeeting(null);
    setShowCreateForm(false);
    setErrors({});

    alert(editingMeeting ? 'Meeting updated successfully!' : 'Meeting created successfully!');
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      place: '',
      purpose: '',
      memberCount: '',
      members: '',
      location: '',
      notes: '',
    });
    setEditingMeeting(null);
    setShowCreateForm(false);
    setErrors({});
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (meeting.members && meeting.members.some(member => 
                           member.toLowerCase().includes(searchQuery.toLowerCase())
                         ));

    const meetingDate = new Date(meeting.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let matchesDate = true;
    if (dateFilter === 'upcoming') {
      matchesDate = meetingDate >= today;
    } else if (dateFilter === 'completed') {
      matchesDate = meetingDate < today;
    }

    return matchesSearch && matchesDate;
  });

  const sortedMeetings = filteredMeetings.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📅 Meetings</h1>
            <p className="text-gray-600 mt-1">Manage your meetings and schedules</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            {showCreateForm ? 'Cancel' : '+ Add Meeting'}
          </button>
        </div>

        {/* Create/Edit Meeting Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {editingMeeting ? 'Edit Meeting' : 'Create New Meeting'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter meeting title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.time ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                </div>

                {/* Place */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Place *
                  </label>
                  <input
                    type="text"
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.place ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g., College Lab"
                  />
                  {errors.place && <p className="text-red-500 text-sm mt-1">{errors.place}</p>}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Computer Science Lab"
                  />
                </div>

                {/* Purpose */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose *
                  </label>
                  <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.purpose ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                    placeholder="What is the meeting about?"
                  />
                  {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
                </div>

                {/* Member Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Members
                  </label>
                  <input
                    type="number"
                    name="memberCount"
                    value={formData.memberCount}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 4"
                  />
                </div>

                {/* Members */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Names (comma separated)
                  </label>
                  <input
                    type="text"
                    name="members"
                    value={formData.members}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Arun, Balu, Kumar, Ravi"
                  />
                </div>

                {/* Additional Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Any additional information..."
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  {editingMeeting ? 'Update Meeting' : 'Create Meeting'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-4">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search meetings by title, purpose, or members..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Date
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Meetings</option>
              <option value="upcoming">Upcoming Meetings</option>
              <option value="completed">Completed Meetings</option>
            </select>
          </div>
        </div>

        {/* Meetings Grid */}
        {sortedMeetings.length > 0 ? (
          <>
            <p className="text-gray-600 mb-4">
              Showing {sortedMeetings.length} meeting{sortedMeetings.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedMeetings.map(meeting => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onEdit={handleEditMeeting}
                  onDelete={handleDeleteMeeting}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            message={
              searchQuery || dateFilter !== 'all'
                ? 'No meetings match your filters'
                : 'No meetings scheduled yet. Create your first meeting!'
            }
            icon="📅"
            actionText="Create Meeting"
          />
        )}
      </div>
    </div>
  );
};

export default Meetings;
