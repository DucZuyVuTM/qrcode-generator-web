import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import QrCodeDisplay from '../components/QrCodeDisplay';
import { createRef } from 'react';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Download: () => <svg data-testid="mock-download-icon" />,
  RefreshCw: () => <svg data-testid="mock-refresh-icon" />,
}));

describe('QrCodeDisplay Component', () => {
  let canvasRef: React.RefObject<HTMLCanvasElement>;
  let onDownloadMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    canvasRef = createRef<HTMLCanvasElement>();
    onDownloadMock = vi.fn();
    vi.useFakeTimers(); // Enable fake timers
  });

  afterEach(() => {
    vi.useRealTimers(); // Clean up timers
  });

  it('should render canvas and show it when qrDataUrl is provided', () => {
    const { container } = render(
      <QrCodeDisplay
        text="https://example.com"
        qrDataUrl="data:image/png/base64,test"
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveStyle({ display: 'block' });
  });

  it('should show download button when qrDataUrl is provided', () => {
    render(
      <QrCodeDisplay
        text="https://example.com"
        qrDataUrl="data:image/png/base64,test"
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    const downloadButton = screen.getByRole('button', { name: /download qr code/i });
    expect(downloadButton).toBeInTheDocument();
    expect(screen.getByTestId('mock-download-icon')).toBeInTheDocument();
  });

  it('should call onDownload when download button is clicked', () => {
    render(
      <QrCodeDisplay
        text="https://example.com"
        qrDataUrl="data:image/png/base64,test"
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    const downloadButton = screen.getByRole('button', { name: /download qr code/i });
    fireEvent.click(downloadButton);

    expect(onDownloadMock).toHaveBeenCalledTimes(1);
  });

  it('should not show download button when qrDataUrl is empty', () => {
    render(
      <QrCodeDisplay
        text="https://example.com"
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    const downloadButton = screen.queryByRole('button', { name: /download qr code/i });
    expect(downloadButton).not.toBeInTheDocument();
  });

  it('should not show QR Code when text is empty', () => {
    const { container } = render(
      <QrCodeDisplay
        text=""
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveStyle({ display: 'none' });
  });

  it('should show loading spinner when isGenerating is true', () => {
    const { container } = render(
      <QrCodeDisplay
        text="https://example.com"
        qrDataUrl="data:image/png/base64,test"
        isGenerating={true}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    const spinner = screen.getByTestId('mock-refresh-icon');
    expect(spinner).toBeInTheDocument();
    const canvas = container.querySelector('canvas'); // Use querySelector instead of queryByRole
    expect(canvas).toBeInTheDocument(); // Canvas still exists but may be covered
  });

  it('should show placeholder after 300ms when text is empty', async () => {
    const { container } = render(
      <QrCodeDisplay
        text=""
        qrDataUrl="data:image/png/base64,test"
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(350); // Advance time by 350ms to trigger 300ms timeout
    });

    await waitFor(
      () => {
        expect(screen.getByText('Enter content to generate QR code')).toBeInTheDocument();
      },
      { timeout: 1000 } // Increased timeout
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveStyle({ display: 'block' }); // Canvas exists but covered by placeholder
  });

  it('should clear timeout and hide placeholder when text becomes non-empty', async () => {
    const { rerender } = render(
      <QrCodeDisplay
        text=""
        qrDataUrl="data:image/png/base64,test"
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    act(() => {
      vi.advanceTimersByTime(350); // Trigger placeholder
    });

    await waitFor(
      () => {
        expect(screen.getByText('Enter content to generate QR code')).toBeInTheDocument();
      },
      { timeout: 1000 } // Increased timeout
    );

    rerender(
      <QrCodeDisplay
        text="https://example.com"
        qrDataUrl="data:image/png/base64,test"
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();
    const canvas = screen.queryByRole('canvas');
    expect(canvas).toHaveStyle({ display: 'block' });
  });

  it('should handle text with only whitespace', async () => {
    const { container } = render(
      <QrCodeDisplay
        text="   "
        qrDataUrl="data:image/png/base64,test"
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(350); // Advance time by 350ms to trigger 300ms timeout
    });

    await waitFor(
      () => {
        expect(screen.getByText('Enter content to generate QR code')).toBeInTheDocument();
      },
      { timeout: 1000 } // Increased timeout
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveStyle({ display: 'block' }); // Canvas exists but covered by placeholder
  });
});