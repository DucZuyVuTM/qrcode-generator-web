import React from 'react';

interface ColorPresetsProps {
  onPresetSelect: (fg: string, bg: string) => void;
};

const ColorPresets: React.FC<ColorPresetsProps> = ({ onPresetSelect }) => {
  const presetColors = [
    { name: 'Classic', fg: '#000000', bg: '#ffffff' },
    { name: 'Ocean', fg: '#1e3a8a', bg: '#dbeafe' },
    { name: 'Forest', fg: '#166534', bg: '#dcfce7' },
    { name: 'Sunset', fg: '#dc2626', bg: '#fef2f2' },
    { name: 'Purple', fg: '#7c3aed', bg: '#f3e8ff' },
    { name: 'Amber', fg: '#d97706', bg: '#fef3c7' },
  ];

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-3 block text-center">
        Color Presets
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {presetColors.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onPresetSelect(preset.fg, preset.bg)}
            className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-all duration-200 group"
          >
            <div className="flex items-center gap-2">
              <div className="flex">
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: preset.fg }}
                />
                <div
                  className="w-4 h-4 rounded-full border -ml-1"
                  style={{ backgroundColor: preset.bg }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600">
                {preset.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPresets;