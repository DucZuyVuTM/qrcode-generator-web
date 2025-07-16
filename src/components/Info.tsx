import React from 'react';

const Info: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          Real-time QR code generation
        </li>
        <li className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
          Customizable colors and styles
        </li>
        <li className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          High-quality PNG download
        </li>
        <li className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
          No server required - runs in browser
        </li>
      </ul>
    </div>
  );
};

export default Info;