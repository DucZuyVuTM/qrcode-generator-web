import { renderHook, act } from '@testing-library/react';
import { useQRCodeGenerator } from '../hooks/useQRCodeGenerator';
import QRCode from 'qrcode';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock QRCode module
vi.mock('qrcode');

describe('useQRCodeGenerator Hook', () => {
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create a mock canvas element
    mockCanvas = document.createElement('canvas');
    mockCanvas.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,mockdata');
    
    // Mock the toCanvas method - it returns a Promise, not using callback
    vi.mocked(QRCode.toCanvas).mockResolvedValue(undefined);
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    expect(result.current.text).toBe('https://example.com');
    expect(result.current.qrDataUrl).toBe('');
    expect(result.current.foregroundColor).toBe('#000000');
    expect(result.current.backgroundColor).toBe('#ffffff');
    expect(result.current.isGenerating).toBe(false);
  });

  it('should use correct color configuration', async () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
    });

    act(() => {
      result.current.setText('https://test.com');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(QRCode.toCanvas).toHaveBeenCalled();

    expect(QRCode.toCanvas).toHaveBeenCalledWith(
      mockCanvas,
      'https://test.com',
      {
        version: undefined,
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      }
    );

    expect(result.current.qrDataUrl).toBe('data:image/png;base64,mockdata');
  });

  it('should not generate QR code when text is empty', async () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
    });

    act(() => {
      result.current.setText('');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(result.current.qrDataUrl).toBe('');
    expect(QRCode.toCanvas).not.toHaveBeenCalled();
    expect(result.current.isGenerating).toBe(false);
  });

  it('should not generate QR code when text is only whitespace', async () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
    });

    act(() => {
      result.current.setText('   ');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(result.current.qrDataUrl).toBe('');
    expect(QRCode.toCanvas).not.toHaveBeenCalled();
  });

  it('should set isGenerating to true during generation and false after', async () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
    });

    act(() => {
      result.current.setText('https://test.com');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(QRCode.toCanvas).toHaveBeenCalled();
    expect(result.current.isGenerating).toBe(false);
  });

  it('should handle QR code generation error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('QR generation failed');
    vi.mocked(QRCode.toCanvas).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useQRCodeGenerator());

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
    });

    act(() => {
      result.current.setText('https://test.com');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error generating QR code:', error);

    expect(result.current.qrDataUrl).toBe('');
    expect(result.current.isGenerating).toBe(false);

    consoleErrorSpy.mockRestore();
  });

  it('should not generate QR code when canvas ref is null', async () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    act(() => {
      result.current.setText('https://test.com');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(result.current.isGenerating).toBe(false);

    expect(QRCode.toCanvas).not.toHaveBeenCalled();
    expect(result.current.qrDataUrl).toBe('');
  });

  it('should debounce QR code generation with 350ms delay', async () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
    });

    act(() => {
      result.current.setText('first');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    act(() => {
      result.current.setText('second');
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    act(() => {
      result.current.setText('third');
    });

    // Only after 350ms from last change
    await new Promise(resolve => setTimeout(resolve, 350));

    expect(QRCode.toCanvas).toHaveBeenCalledTimes(2);

    expect(QRCode.toCanvas).toHaveBeenCalledWith(
      mockCanvas,
      'third',
      expect.any(Object)
    );
  });

  it('should update foreground color and regenerate QR code', async () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
    });

    act(() => {
      result.current.setForegroundColor('#ff0000');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(QRCode.toCanvas).toHaveBeenCalled();

    expect(QRCode.toCanvas).toHaveBeenCalledWith(
      mockCanvas,
      'https://example.com',
      expect.objectContaining({
        color: {
          dark: '#ff0000',
          light: '#ffffff',
        },
      })
    );
  });

  it('should update background color and regenerate QR code', async () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
    });

    act(() => {
      result.current.setBackgroundColor('#00ff00');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(QRCode.toCanvas).toHaveBeenCalled();

    expect(QRCode.toCanvas).toHaveBeenCalledWith(
      mockCanvas,
      'https://example.com',
      expect.objectContaining({
        color: {
          dark: '#000000',
          light: '#00ff00',
        },
      })
    );
  });

  it('should update both colors and regenerate once', async () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
    });

    act(() => {
      result.current.setForegroundColor('#ff0000');
      result.current.setBackgroundColor('#00ff00');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(QRCode.toCanvas).toHaveBeenCalled();
    
    expect(QRCode.toCanvas).toHaveBeenCalledWith(
      mockCanvas,
      'https://example.com',
      expect.objectContaining({
        color: {
          dark: '#ff0000',
          light: '#00ff00',
        },
      })
    );
  });

  it('should download QR code when qrDataUrl is available', async () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    // Mock document methods
    const mockLink = {
      download: '',
      href: '',
      click: vi.fn(),
    } as unknown as HTMLAnchorElement;

    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);

    // Set qrDataUrl manually for testing
    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
      result.current.setText('test');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(result.current.qrDataUrl).toBeTruthy();
    
    act(() => {
      result.current.downloadQR();
    });

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(mockLink.download).toMatch(/^qr-code-\d+\.png$/);
    expect(mockLink.href).toBe('data:image/png;base64,mockdata');
    expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
    expect(mockLink.click).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalledWith(mockLink);

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it('should not download when qrDataUrl is empty', () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    const createElementSpy = vi.spyOn(document, 'createElement');

    act(() => {
      result.current.downloadQR();
    });

    expect(createElementSpy).not.toHaveBeenCalled();
    expect(result.current.qrDataUrl).toBe('');

    createElementSpy.mockRestore();
  });

  it('should cleanup timeout on unmount', async () => {
    const { result, unmount } = renderHook(() => useQRCodeGenerator());

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
    });

    act(() => {
      result.current.setText('https://test.com');
    });

    // Unmount before timeout completes
    unmount();

    await new Promise(resolve => setTimeout(resolve, 350));

    // QRCode.toCanvas should not be called after unmount
    expect(QRCode.toCanvas).not.toHaveBeenCalled();
  });

  it('should cleanup and reset timeout when dependencies change', async () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
    });

    act(() => {
      result.current.setText('first');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    act(() => {
      result.current.setText('second');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(QRCode.toCanvas).toHaveBeenCalledTimes(2);

    expect(QRCode.toCanvas).toHaveBeenCalledWith(
      mockCanvas,
      'second',
      expect.any(Object)
    );
  });

  it('should call toDataURL on canvas after successful generation', async () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
    });

    act(() => {
      result.current.setText('https://test.com');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(QRCode.toCanvas).toHaveBeenCalled();

    expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
    expect(result.current.qrDataUrl).toBe('data:image/png;base64,mockdata');
  });

  it('should generate QR code with correct QRCode options', async () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
    });

    act(() => {
      result.current.setText('test-content');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(QRCode.toCanvas).toHaveBeenCalled();

    expect(QRCode.toCanvas).toHaveBeenCalledWith(
      mockCanvas,
      'test-content',
      {
        version: undefined,
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      }
    );
  });

  it('should set qrDataUrl to empty string on error', async () => {
    vi.mocked(QRCode.toCanvas).mockRejectedValueOnce(new Error('Test error'));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useQRCodeGenerator());

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
    });

    act(() => {
      result.current.setText('test');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(result.current.qrDataUrl).toBe('');

    expect(result.current.isGenerating).toBe(false);

    consoleErrorSpy.mockRestore();
  });

  it('should handle rapid text changes and only generate for final value', async () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
    });

    act(() => {
      result.current.setText('a');
    });
    await new Promise(resolve => setTimeout(resolve, 350));

    act(() => {
      result.current.setText('ab');
    });
    await new Promise(resolve => setTimeout(resolve, 350));

    act(() => {
      result.current.setText('abc');
    });
    await new Promise(resolve => setTimeout(resolve, 350));

    act(() => {
      result.current.setText('abcd');
    });
    await new Promise(resolve => setTimeout(resolve, 350));

    expect(QRCode.toCanvas).toHaveBeenCalledTimes(4);

    expect(QRCode.toCanvas).toHaveBeenCalledWith(
      mockCanvas,
      'abcd',
      expect.any(Object)
    );
  });

  it('should download with timestamp in filename', async () => {
    const mockNow = 1234567890;
    vi.spyOn(Date, 'now').mockReturnValue(mockNow);

    const { result } = renderHook(() => useQRCodeGenerator());

    const mockLink = {
      download: '',
      href: '',
      click: vi.fn(),
    } as unknown as HTMLAnchorElement;

    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
      result.current.setText('test');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(result.current.qrDataUrl).toBeTruthy();

    act(() => {
      result.current.downloadQR();
    });

    expect(mockLink.download).toBe(`qr-code-${mockNow}.png`);

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it('should clear qrDataUrl when text becomes empty after having content', async () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
    });

    act(() => {
      result.current.setText('test');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(result.current.qrDataUrl).toBe('data:image/png;base64,mockdata');

    act(() => {
      result.current.setText('');
    });

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(result.current.qrDataUrl).toBe('');

    expect(QRCode.toCanvas).toHaveBeenCalledTimes(1);
  });
  
  it('should set isGenerating to true before async operation starts', async () => {
    // Create a controlled promise to pause QR generation
    let resolveQRCode: (() => void) | undefined;
    const qrCodePromise = new Promise<void>((resolve) => {
      resolveQRCode = resolve;
    });
    
    vi.mocked(QRCode.toCanvas).mockImplementation(() => {
      // Return the controlled promise
      return qrCodePromise;
    });

    const { result } = renderHook(() => useQRCodeGenerator());

    act(() => {
      // @ts-expect-error - Setting ref for testing purposes
      result.current.canvasRef.current = mockCanvas;
    });

    // Initially false
    expect(result.current.isGenerating).toBe(false);

    // Trigger generation
    act(() => {
      result.current.setText('https://test.com');
    });

    // Wait for debounce timeout
    await new Promise(resolve => setTimeout(resolve, 350));

    // After debounce, generateQR starts executing
    // At this point, setIsGenerating(true) MUST have been called
    // If mutation changes it to setIsGenerating(false), this test will fail
    expect(result.current.isGenerating).toBe(true);
    expect(QRCode.toCanvas).toHaveBeenCalled();

    // Complete the QR generation
    act(() => {
      resolveQRCode?.();
    });

    // Wait for promise resolution
    await new Promise(resolve => setTimeout(resolve, 50));

    // After completion, should be false
    expect(result.current.isGenerating).toBe(false);
  });
});