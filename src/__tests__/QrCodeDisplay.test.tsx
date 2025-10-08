import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render canvas and show it when qrDataUrl is provided', () => {
    const { container } = render(
      <QrCodeDisplay
        text="https://example.com"
        qrDataUrl="data:image/png;base64,test"
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
        qrDataUrl="data:image/png;base64,test"
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
        qrDataUrl="data:image/png;base64,test"
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

  it('should not show QR Code when text is empty', async () => {
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
});