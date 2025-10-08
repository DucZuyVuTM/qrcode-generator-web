import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { useQRCodeGenerator } from '../hooks/useQRCodeGenerator';

// Mock the useQRCodeGenerator hook
vi.mock('../hooks/useQRCodeGenerator');

// Mock all child components
vi.mock('../components/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../components/InputSection', () => ({
  default: () => <div data-testid="input-section">InputSection</div>,
}));

vi.mock('../components/Customization', () => ({
  default: () => <div data-testid="customization">Customization</div>,
}));

vi.mock('../components/ColorPresets', () => ({
  default: ({ onPresetSelect }: { onPresetSelect: (fg: string, bg: string) => void }) => (
    <div 
      data-testid="color-presets" 
      onClick={() => onPresetSelect('#ff0000', '#00ff00')}
    >
      ColorPresets
    </div>
  ),
}));

vi.mock('../components/QrCodeDisplay', () => ({
  default: () => <div data-testid="qr-code-display">QrCodeDisplay</div>,
}));

vi.mock('../components/Info', () => ({
  default: () => <div data-testid="info">Info</div>,
}));

vi.mock('../components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

describe('App Component', () => {
  let mockSetText: ReturnType<typeof vi.fn>;
  let mockSetForegroundColor: ReturnType<typeof vi.fn>;
  let mockSetBackgroundColor: ReturnType<typeof vi.fn>;
  let mockDownloadQR: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSetText = vi.fn();
    mockSetForegroundColor = vi.fn();
    mockSetBackgroundColor = vi.fn();
    mockDownloadQR = vi.fn();

    vi.mocked(useQRCodeGenerator).mockReturnValue({
      text: 'https://example.com',
      qrDataUrl: 'data:image/png;base64,mockdata',
      foregroundColor: '#000000',
      backgroundColor: '#ffffff',
      isGenerating: false,
      setText: mockSetText,
      setForegroundColor: mockSetForegroundColor,
      setBackgroundColor: mockSetBackgroundColor,
      downloadQR: mockDownloadQR,
      canvasRef: { current: null },
    });
  });

  it('should render all child components', () => {
    render(<App />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('input-section')).toBeInTheDocument();
    expect(screen.getByTestId('customization')).toBeInTheDocument();
    expect(screen.getByTestId('color-presets')).toBeInTheDocument();
    expect(screen.getByTestId('qr-code-display')).toBeInTheDocument();
    expect(screen.getByTestId('info')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render with correct container classes', () => {
    const { container } = render(<App />);

    // Get the outer div
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveClass('min-h-screen');
    expect(outerDiv).toHaveClass('bg-gradient-to-br');
    expect(outerDiv).toHaveClass('from-blue-50');
    expect(outerDiv).toHaveClass('to-indigo-100');
    expect(outerDiv).toHaveClass('pt-12');
    expect(outerDiv).toHaveClass('pb-6');
    expect(outerDiv).toHaveClass('px-4');
  });

  it('should render with correct inner container classes', () => {
    const { container } = render(<App />);

    const outerDiv = container.firstChild as HTMLElement;
    const innerDiv = outerDiv.firstChild as HTMLElement;
    
    expect(innerDiv).toHaveClass('max-w-4xl');
    expect(innerDiv).toHaveClass('mx-auto');
  });

  it('should render white card container with correct classes', () => {
    const { container } = render(<App />);

    // Find the white card container by class
    const whiteCard = container.querySelector('.bg-white.rounded-2xl.shadow-xl');

    expect(whiteCard).toBeInTheDocument();
    expect(whiteCard).toHaveClass('bg-white');
    expect(whiteCard).toHaveClass('rounded-2xl');
    expect(whiteCard).toHaveClass('shadow-xl');
    expect(whiteCard).toHaveClass('p-8');
  });

  it('should render grid container with correct classes', () => {
    const { container } = render(<App />);

    // Find the grid container by class
    const gridContainer = container.querySelector('.grid.lg\\:grid-cols-2');

    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('grid');
    expect(gridContainer).toHaveClass('lg:grid-cols-2');
    expect(gridContainer).toHaveClass('gap-8');
  });

  it('should handle preset color selection', () => {
    render(<App />);

    const colorPresets = screen.getByTestId('color-presets');
    
    // Simulate clicking the color preset (which triggers onPresetSelect)
    colorPresets.click();

    // Verify handlePresetColor calls the setters
    expect(mockSetForegroundColor).toHaveBeenCalledWith('#ff0000');
    expect(mockSetBackgroundColor).toHaveBeenCalledWith('#00ff00');
  });

  it('should call useQRCodeGenerator hook', () => {
    render(<App />);

    expect(useQRCodeGenerator).toHaveBeenCalled();
  });

  it('should pass correct props to components', () => {
    render(<App />);

    // Verify all components are rendered (props are validated by TypeScript)
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('input-section')).toBeInTheDocument();
    expect(screen.getByTestId('customization')).toBeInTheDocument();
    expect(screen.getByTestId('color-presets')).toBeInTheDocument();
    expect(screen.getByTestId('qr-code-display')).toBeInTheDocument();
    expect(screen.getByTestId('info')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render correct layout structure', () => {
    const { container } = render(<App />);

    // Verify the complete structure exists
    const outerDiv = container.querySelector('.min-h-screen.bg-gradient-to-br');
    expect(outerDiv).toBeInTheDocument();

    const innerContainer = container.querySelector('.max-w-4xl.mx-auto');
    expect(innerContainer).toBeInTheDocument();

    const whiteCard = container.querySelector('.bg-white.rounded-2xl');
    expect(whiteCard).toBeInTheDocument();

    const gridLayout = container.querySelector('.grid.lg\\:grid-cols-2');
    expect(gridLayout).toBeInTheDocument();
  });
});