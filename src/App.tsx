import React from 'react';
import { useQRCodeGenerator } from './hooks/useQRCodeGenerator';
import Header from './components/Header';
import InputSection from './components/InputSection';
import Customization from './components/Customization';
import QrCodeDisplay from './components/QrCodeDisplay';
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
  } = useQRCodeGenerator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Header title="QR Code Generator" subtitle="Convert any text to QR code instantly" />
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <InputSection text={text} setText={setText} />
            <Customization
              foregroundColor={foregroundColor}
              setForegroundColor={setForegroundColor}
              backgroundColor={backgroundColor}
              setBackgroundColor={setBackgroundColor}
            />
          </div>
          <div className="space-y-6">
            <QrCodeDisplay
              qrDataUrl={qrDataUrl}
              isGenerating={isGenerating}
              downloadQR={downloadQR}
              canvasRef={useQRCodeGenerator().canvasRef}
              text={text}
            />
            <Info />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;