import React from 'react';
import { Download, QrCode } from 'lucide-react';

interface QrCodeDisplayProps {
  qrDataUrl: string;
  isGenerating: boolean;
  downloadQR: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  text: string;
};

const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({
  qrDataUrl,
  isGenerating,
  downloadQR,
  canvasRef,
  text,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Generated QR Code</h2>
        {qrDataUrl && (
          <button
            onClick={downloadQR}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        )}
      </div>
      
      <div className="flex items-center justify-center">
        {text.trim() ? (
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto rounded-lg border border-gray-200"
              style={{ display: qrDataUrl ? 'block' : 'none' }}
            />
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <QrCode className="w-16 h-16 mb-4" />
            <p className="text-lg">Enter text to generate QR code</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrCodeDisplay;