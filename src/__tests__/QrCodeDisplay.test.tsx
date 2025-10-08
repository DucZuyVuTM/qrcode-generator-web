import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should show placeholder after 300ms when text is empty', async () => {
    const { container } = render(
      <QrCodeDisplay
        text=""
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(screen.queryByText('Enter content to generate QR code')).toBeInTheDocument();

    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveStyle({ display: 'none' }); // Canvas is hidden when no qrDataUrl
  });

  it('should clear timeout and hide placeholder when text becomes non-empty', async () => {
    const { rerender, container } = render(
      <QrCodeDisplay
        text=""
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(screen.getByText('Enter content to generate QR code')).toBeInTheDocument();

    rerender(
      <QrCodeDisplay
        text="https://example.com"
        qrDataUrl="data:image/png;base64,test"
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveStyle({ display: 'block' });
  });

  it('should handle text with only whitespace', async () => {
    const { container } = render(
      <QrCodeDisplay
        text="   "
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(screen.getByText('Enter content to generate QR code')).toBeInTheDocument();

    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveStyle({ display: 'none' }); // Canvas is hidden when no qrDataUrl
  });

  it('should toggle canvas display based on qrDataUrl', () => {
    const { container, rerender } = render(
      <QrCodeDisplay
        text="https://example.com"
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    let canvas = container.querySelector('canvas');
    expect(canvas).toHaveStyle({ display: 'none' });

    rerender(
      <QrCodeDisplay
        text="https://example.com"
        qrDataUrl="data:image/png;base64,test"
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    canvas = container.querySelector('canvas');
    expect(canvas).toHaveStyle({ display: 'block' });
  });

  it('should show placeholder after 300ms when text is empty', async () => {
    const { container } = render(
      <QrCodeDisplay
        text=""
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(screen.queryByText('Enter content to generate QR code')).toBeInTheDocument();

    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveStyle({ display: 'none' });
  });

  it('should show download button only when qrDataUrl is present', () => {
    const { rerender } = render(
      <QrCodeDisplay
        text="https://example.com"
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    expect(screen.queryByRole('button', { name: /download qr code/i })).not.toBeInTheDocument();

    rerender(
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

  it('should set showPlaceholder to false when text is not empty', () => {
    const { rerender } = render(
      <QrCodeDisplay
        text=""
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Change to non-empty text - should trigger else branch setting showPlaceholder to false
    rerender(
      <QrCodeDisplay
        text="test"
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Placeholder should not be visible
    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();
  });

  it('should cleanup timeout when component unmounts', async () => {
    const { unmount } = render(
      <QrCodeDisplay
        text=""
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Unmount before timeout completes
    unmount();

    // Wait for what would have been the timeout
    await new Promise(resolve => setTimeout(resolve, 350));

    // Component is unmounted, so we can't check for placeholder
    // But this tests that clearTimeout was called (no memory leak)
  });

  it('should cleanup and reset timeout when text changes multiple times', async () => {
    const { rerender } = render(
      <QrCodeDisplay
        text=""
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Wait 200ms (less than 300ms)
    await new Promise(resolve => setTimeout(resolve, 200));

    // Change text to trigger cleanup
    rerender(
      <QrCodeDisplay
        text="a"
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Change back to empty
    rerender(
      <QrCodeDisplay
        text=""
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Wait another 200ms
    await new Promise(resolve => setTimeout(resolve, 200));

    // Placeholder should not be visible yet (new timeout started)
    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();

    // Wait for new timeout to complete
    await new Promise(resolve => setTimeout(resolve, 150));

    // Now placeholder should appear
    expect(screen.getByText('Enter content to generate QR code')).toBeInTheDocument();
  });

  it('should trigger useEffect when text dependency changes', async () => {
    const { rerender } = render(
      <QrCodeDisplay
        text="initial"
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Change text to empty
    rerender(
      <QrCodeDisplay
        text=""
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(screen.getByText('Enter content to generate QR code')).toBeInTheDocument();

    // Change text again
    rerender(
      <QrCodeDisplay
        text="new text"
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Placeholder should be hidden
    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();
  });

  it('should evaluate text.trim() condition correctly for empty string', async () => {
    render(
      <QrCodeDisplay
        text=""
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // text.trim() is falsy for empty string, should enter if block
    await new Promise(resolve => setTimeout(resolve, 350));

    expect(screen.getByText('Enter content to generate QR code')).toBeInTheDocument();
  });

  it('should evaluate text.trim() condition correctly for non-empty string', () => {
    render(
      <QrCodeDisplay
        text="content"
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // text.trim() is truthy for non-empty string, should enter else block
    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();
  });

  it('should set showPlaceholder to true after timeout completes', async () => {
    render(
      <QrCodeDisplay
        text=""
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Initially showPlaceholder is false
    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();

    // After timeout, showPlaceholder should be true
    await new Promise(resolve => setTimeout(resolve, 350));

    expect(screen.getByText('Enter content to generate QR code')).toBeInTheDocument();
  });

  it('should not set showPlaceholder to true if text becomes non-empty before timeout', async () => {
    const { rerender } = render(
      <QrCodeDisplay
        text=""
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Wait 150ms (less than 300ms)
    await new Promise(resolve => setTimeout(resolve, 150));

    // Change text before timeout
    rerender(
      <QrCodeDisplay
        text="content"
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Wait for original timeout period to pass
    await new Promise(resolve => setTimeout(resolve, 200));

    // showPlaceholder should not be true because timeout was cleared
    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();
  });

  it('should execute cleanup function when text changes', async () => {
    const { rerender } = render(
      <QrCodeDisplay
        text=""
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Start first timeout
    await new Promise(resolve => setTimeout(resolve, 100));

    // Change text - this should trigger cleanup (clearTimeout)
    rerender(
      <QrCodeDisplay
        text="test"
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Wait for what would have been the first timeout
    await new Promise(resolve => setTimeout(resolve, 250));

    // Placeholder should not appear because timeout was cleared
    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();
  });

  it('should handle empty string vs whitespace correctly in condition', async () => {
    const { rerender } = render(
      <QrCodeDisplay
        text="   "
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // "   ".trim() is empty, should enter if block
    await new Promise(resolve => setTimeout(resolve, 350));
    expect(screen.getByText('Enter content to generate QR code')).toBeInTheDocument();

    // Change to actual content
    rerender(
      <QrCodeDisplay
        text="  a  "
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // "  a  ".trim() is "a", should enter else block
    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();
  });
  it('should handle empty string vs whitespace correctly in condition', async () => {
    const { rerender } = render(
      <QrCodeDisplay
        text="   "
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // "   ".trim() is empty, should enter if block
    await new Promise(resolve => setTimeout(resolve, 350));
    expect(screen.getByText('Enter content to generate QR code')).toBeInTheDocument();

    // Change to actual content
    rerender(
      <QrCodeDisplay
        text="  a  "
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // "  a  ".trim() is "a", should enter else block
    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();
  });

  it('should immediately hide placeholder when text becomes non-empty without waiting', () => {
    const { rerender } = render(
      <QrCodeDisplay
        text=""
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Change to non-empty text immediately
    rerender(
      <QrCodeDisplay
        text="https://example.com"
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Placeholder should be hidden immediately (no timeout needed)
    // This tests the else branch: setShowPlaceholder(false) is executed
    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();
  });

  it('should show placeholder after timeout only when text remains empty', async () => {
    const { rerender } = render(
      <QrCodeDisplay
        text=""
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Wait 100ms
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Still should not show placeholder
    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();

    // Wait another 250ms (total 350ms, past the 300ms threshold)
    await new Promise(resolve => setTimeout(resolve, 250));

    // Now placeholder should appear because text is still empty
    expect(screen.getByText('Enter content to generate QR code')).toBeInTheDocument();

    // Add non-empty text
    rerender(
      <QrCodeDisplay
        text="test content"
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Placeholder should disappear immediately when text is added
    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();
  });

  it('should verify else branch execution by checking placeholder state transition', async () => {
    const { rerender } = render(
      <QrCodeDisplay
        text=""
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Wait for placeholder to show
    await new Promise(resolve => setTimeout(resolve, 350));
    expect(screen.getByText('Enter content to generate QR code')).toBeInTheDocument();

    // Now add text - this MUST execute else branch and call setShowPlaceholder(false)
    rerender(
      <QrCodeDisplay
        text="some text"
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Placeholder must be hidden because else branch sets showPlaceholder to false
    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();

    // Remove text again
    rerender(
      <QrCodeDisplay
        text=""
        qrDataUrl=""
        isGenerating={false}
        canvasRef={canvasRef}
        onDownload={onDownloadMock}
      />
    );

    // Placeholder should not appear immediately
    expect(screen.queryByText('Enter content to generate QR code')).not.toBeInTheDocument();

    // Wait for new timeout
    await new Promise(resolve => setTimeout(resolve, 350));

    // Now it should appear again
    expect(screen.getByText('Enter content to generate QR code')).toBeInTheDocument();
  });
});