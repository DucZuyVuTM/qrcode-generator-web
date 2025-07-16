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
  const [text, setText] = useState('https://example.com');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
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
          version: undefined,
          width: 300,
          margin: 2,
          color: {
            dark: foregroundColor,
            light: backgroundColor,
          },
          errorCorrectionLevel: 'M',
        });
        const dataUrl = canvas.toDataURL('image/png');
        setQrDataUrl(dataUrl);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      setQrDataUrl('');
    } finally {
      setIsGenerating(false);
    }
  }, [foregroundColor, backgroundColor]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateQR(text);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [text, foregroundColor, backgroundColor, generateQR]);

  const downloadQR = useCallback(() => {
    if (qrDataUrl) {
      const link = document.createElement('a');
      link.download = `qr-code-${Date.now()}.png`;
      link.href = qrDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [qrDataUrl]);

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
    canvasRef,
  };
};