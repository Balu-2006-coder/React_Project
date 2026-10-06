import React from 'react';

const DashboardCard = ({ title, count, icon, color, link }) => {
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    orange: 'bg-orange-500 hover:bg-orange-600',
    pink: 'bg-pink-500 hover:bg-pink-600',
  };

  return (
    <div className={`${colorClasses[color]} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-medium opacity-90">{title}</p>
          <p className="text-4xl font-bold mt-2">{count}</p>
        </div>
        <div className="text-5xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
