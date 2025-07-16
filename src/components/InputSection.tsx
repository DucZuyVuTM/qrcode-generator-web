import React from 'react';
import { Type } from 'lucide-react';

interface InputSectionProps {
  text: string;
  setText: (text: string) => void;
};

const InputSection: React.FC<InputSectionProps> = ({ text, setText }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Type className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Enter Text</h2>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter anything to generate QR code..."
        className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
      />
    </div>
  );
};

export default InputSection;