import React from 'react';
import { Type } from 'lucide-react';

interface InputSectionProps {
  text: string;
  setText: (text: string) => void;
};

const InputSection: React.FC<InputSectionProps> = ({ text, setText }) => {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
        <Type className="w-4 h-4" />
        QR Code Content
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter URL, text, or any content..."
        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
        rows={4}
      />
    </div>
  );
};

export default InputSection;