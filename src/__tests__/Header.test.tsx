import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Header from '../components/Header';

// Mock lucide-react to avoid rendering issues in tests
vi.mock('lucide-react', () => ({
  QrCode: ({ className }: { className: string }) => (
    <svg data-testid="qr-code-icon" className={className} />
  ),
}));

describe('Header Component', () => {
  it('renders correctly with all elements and styles', () => {
    render(<Header />);

    // Verify the container div
    const container = screen.getByText('QR Code Generator').parentElement?.parentElement;
    expect(container).toHaveClass('text-center', 'mb-8');

    // Verify the flex container
    const flexContainer = screen.getByText('QR Code Generator').parentElement;
    expect(flexContainer).toHaveClass('flex', 'items-center', 'justify-center', 'gap-3', 'mb-4');

    // Verify the QrCode icon
    const qrCodeIcon = screen.getByTestId('qr-code-icon');
    expect(qrCodeIcon).toBeInTheDocument();
    expect(qrCodeIcon).toHaveClass('w-12', 'h-12', 'text-blue-600');

    // Verify the h1 title
    const title = screen.getByText('QR Code Generator');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-4xl', 'font-bold', 'text-gray-800', 'mb-2', 'max-[418px]:w-[171px]');

    // Verify the description paragraph
    const description = screen.getByText('Create beautiful QR codes with customizable colors');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-gray-600', 'text-lg');
  });
});