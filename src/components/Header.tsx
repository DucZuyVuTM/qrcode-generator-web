import React from 'react';
import { QrCode } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
};

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <QrCode className="w-8 h-8 text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
      </div>
      <p className="text-lg text-gray-600">{subtitle}</p>
    </div>
  );
};

export default Header;