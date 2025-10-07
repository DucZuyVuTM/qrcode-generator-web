import { renderHook, act, waitFor } from '@testing-library/react';
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

  it('should use correct color configuration', async () => {
    const { result } = renderHook(() => useQRCodeGenerator());

    // Manually set the canvas ref to mock canvas
    act(() => {
      if (result.current.canvasRef.current === null) {
        // @ts-expect-error - Setting ref for testing purposes
        result.current.canvasRef.current = mockCanvas;
      }
    });

    // Change text to trigger generateQR
    act(() => {
      result.current.setText('https://test.com');
    });

    // Wait for the mock to be called
    await waitFor(
      () => {
        expect(QRCode.toCanvas).toHaveBeenCalled();
      },
      { timeout: 500 }
    );

    // Check that QRCode.toCanvas is called
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

    // Check generated qrDataUrl
    expect(result.current.qrDataUrl).toBe('data:image/png;base64,mockdata');
  });
});