import React from 'react';

export default function LevelCard({ level, onClick }) {
  const getColorClasses = (color) => {
    switch(color) {
      case 'purple':
        return 'border-purple-500/30 bg-purple-950/20 hover:border-purple-500/60';
      case 'blue':
        return 'border-blue-500/30 bg-blue-950/20 hover:border-blue-500/60';
      case 'orange':
        return 'border-orange-500/30 bg-orange-950/20 hover:border-orange-500/60';
      default:
        return 'border-gray-500/30 bg-gray-950/20 hover:border-gray-500/60';
    }
  };

  const getBadgeClasses = (color) => {
    switch(color) {
      case 'purple':
        return 'bg-purple-500/20 text-purple-300';
      case 'blue':
        return 'bg-blue-500/20 text-blue-300';
      case 'orange':
        return 'bg-orange-500/20 text-orange-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div
      onClick={() => onClick(level)}
      className={`border-2 rounded-xl p-6 transition-all duration-300 cursor-pointer group ${getColorClasses(level.color)}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-bold px-2 py-1 rounded ${getBadgeClasses(level.color)}`}>
          {level.number}
        </span>
        {level.status === 'locked' && (
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        )}
        {level.status === 'completed' && (
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
        {level.status === 'unlocked' && (
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        )}
      </div>
      <h3 className="text-sm font-bold mb-1 group-hover:text-white transition-colors">
        {level.title}
      </h3>
      {level.description && (
        <p className="text-xs text-gray-500">{level.description}</p>
      )}
    </div>
  );
}
