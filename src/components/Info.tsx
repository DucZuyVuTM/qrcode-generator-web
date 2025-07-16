import React from 'react';
import { Palette, Download, RefreshCw } from 'lucide-react';

const Info: React.FC = () => {
  const features = [
    {
      icon: Palette,
      title: 'Color Customization',
      description: 'Change foreground and background colors to create unique QR codes',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Download,
      title: 'Easy Download',
      description: 'Download QR codes as high-quality PNG files',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: RefreshCw,
      title: 'Real-time Updates',
      description: 'QR codes are generated instantly when you change content',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-md">
          <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
            <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Info;