import { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';

interface UseQRCodeGeneratorResult {
  text: string;
  qrDataUrl: string;
  foregroundColor: string;
  backgroundColor: string;
  isGenerating: boolean;
  setText: (text: string) => void;
  setForegroundColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  downloadQR: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

export const useQRCodeGenerator = (): UseQRCodeGeneratorResult => {
  const [text, setText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ADFF2F');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = useCallback(async (inputText: string) => {
    if (!inputText.trim()) {
      setQrDataUrl('');
      return;
    }

    setIsGenerating(true);
    try {
      const canvas = canvasRef.current;
      if (canvas) {
        await QRCode.toCanvas(canvas, inputText, {
          version: 3,
          width: 256,
          margin: 4,
          color: {
            dark: foregroundColor,
            light: backgroundColor,
          },
        });
        const dataUrl = canvas.toDataURL();
        setQrDataUrl(dataUrl);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [canvasRef, setQrDataUrl, setIsGenerating, foregroundColor, backgroundColor]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateQR(text);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [text, foregroundColor, backgroundColor, generateQR]);

  const downloadQR = () => {
    if (qrDataUrl) {
      const link = document.createElement('a');
      link.download = 'qr_code.png';
      link.href = qrDataUrl;
      link.click();
    }
  };

  return {
    text,
    qrDataUrl,
    foregroundColor,
    backgroundColor,
    isGenerating,
    setText,
    setForegroundColor,
    setBackgroundColor,
    downloadQR,
    canvasRef
  };
};