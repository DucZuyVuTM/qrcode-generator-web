import React from 'react';
import { useQRCodeGenerator } from './hooks/useQRCodeGenerator';
import Header from './components/Header';
import InputSection from './components/InputSection';
import Customization from './components/Customization';
import QrCodeDisplay from './components/QrCodeDisplay';
import ColorPresets from './components/ColorPresets';
import Info from './components/Info';

const App: React.FC = () => {
  const {
    text,
    qrDataUrl,
    foregroundColor,
    backgroundColor,
    isGenerating,
    setText,
    setForegroundColor,
    setBackgroundColor,
    downloadQR,
    canvasRef,
  } = useQRCodeGenerator();

  const handlePresetColor = (fg: string, bg: string) => {
    setForegroundColor(fg);
    setBackgroundColor(bg);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Header />

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <InputSection text={text} setText={setText} />
              
              <Customization
                foregroundColor={foregroundColor}
                backgroundColor={backgroundColor}
                setForegroundColor={setForegroundColor}
                setBackgroundColor={setBackgroundColor}
              />

              <ColorPresets onPresetSelect={handlePresetColor} />
            </div>

            {/* QR Code Display */}
            <QrCodeDisplay
              text={text}
              qrDataUrl={qrDataUrl}
              isGenerating={isGenerating}
              canvasRef={canvasRef}
              onDownload={downloadQR}
            />
          </div>
        </div>

        <Info />
      </div>
    </div>
  );
};

export default App;