import React from 'react';
import { Palette } from 'lucide-react';

interface CustomizationProps {
  foregroundColor: string;
  setForegroundColor: (color: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
};

const Customization: React.FC<CustomizationProps> = ({
  foregroundColor,
  setForegroundColor,
  backgroundColor,
  setBackgroundColor,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <Palette className="w-4 h-4" />
          Foreground Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={foregroundColor}
            onChange={(e) => setForegroundColor(e.target.value)}
            className="w-12 min-w-[8px] h-12 border border-gray-300 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={foregroundColor}
            onChange={(e) => setForegroundColor(e.target.value)}
            className="flex-1 min-w-[150px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="#000000"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <Palette className="w-4 h-4" />
          Background Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-12 min-w-[8px] h-12 border border-gray-300 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="flex-1 min-w-[150px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="#ffffff"
          />
        </div>
      </div>
    </div>
  );
};

export default Customization;