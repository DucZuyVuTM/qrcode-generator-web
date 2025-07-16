import React from 'react';
import { Download, RefreshCw } from 'lucide-react';

interface QrCodeDisplayProps {
  text: string;
  qrDataUrl: string;
  isGenerating: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onDownload: () => void;
};

const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({
  text,
  qrDataUrl,
  isGenerating,
  canvasRef,
  onDownload,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-50 rounded-xl p-6 mb-6 relative">
        {isGenerating && (
          <div className="absolute inset-0 bg-white bg-opacity-75 rounded-xl flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto rounded-lg shadow-sm"
          style={{ display: qrDataUrl ? 'block' : 'none' }}
        />
        
        {!text.trim() && (
          <div className="w-72 h-72 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-center">
              Enter content to generate QR code
            </p>
          </div>
        )}
      </div>

      {qrDataUrl && (
        <button
          onClick={onDownload}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
        >
          <Download className="w-5 h-5" />
          Download QR Code
        </button>
      )}
    </div>
  );
};

export default QrCodeDisplay;