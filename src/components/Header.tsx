import React from 'react';
import { QrCode } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <QrCode className="w-12 h-12 text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2 max-[418px]:w-[171px]">
          QR Code Generator
        </h1>
      </div>
      <p className="text-gray-600 text-lg">
        Create beautiful QR codes with customizable colors
      </p>
    </div>
  );
};

export default Header;