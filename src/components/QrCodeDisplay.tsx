import React, { useState, useEffect } from 'react';
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
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    if (!text.trim()) {
      const timeoutId = setTimeout(() => {
        setShowPlaceholder(true);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setShowPlaceholder(false);
    }
  }, [text]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-xs mx-auto">
        <div className="bg-gray-50 rounded-xl p-6 mb-6 relative aspect-square">
          {isGenerating && (
            <div className="absolute inset-0 bg-white bg-opacity-75 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          )}
          
          <div className="w-full h-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full rounded-lg shadow-sm"
            />
            
            {!text.trim() && showPlaceholder && (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center transition-opacity duration-300 ease-in-out">
                <p className="text-gray-500 text-center px-4">
                  Enter content to generate QR code
                </p>
              </div>
            )}
          </div>
        </div>
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