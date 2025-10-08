import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Info from '../components/Info';

// Mock lucide-react icons to avoid rendering issues in tests
vi.mock('lucide-react', () => ({
  Palette: ({ className }: { className: string }) => (
    <svg data-testid="palette-icon" className={className} />
  ),
  Download: ({ className }: { className: string }) => (
    <svg data-testid="download-icon" className={className} />
  ),
  RefreshCw: ({ className }: { className: string }) => (
    <svg data-testid="refreshcw-icon" className={className} />
  ),
}));

describe('Info Component', () => {
  it('renders all feature cards with correct content and styles', () => {
    render(<Info />);

    // Verify the outer grid div
    const gridDiv = screen.getByText('Color Customization').parentElement?.parentElement;
    expect(gridDiv).toHaveClass('mt-12', 'grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-6');

    // Define expected features for verification
    const expectedFeatures = [
      {
        title: 'Color Customization',
        description: 'Change foreground and background colors to create unique QR codes',
        iconTestId: 'palette-icon',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
      },
      {
        title: 'Easy Download',
        description: 'Download QR codes as high-quality PNG files',
        iconTestId: 'download-icon',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
      },
      {
        title: 'Real-time Updates',
        description: 'QR codes are generated instantly when you change content',
        iconTestId: 'refreshcw-icon',
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600',
      },
    ];

    // Verify each feature card
    expectedFeatures.forEach((feature) => {
      // Verify the feature card container
      const card = screen.getByText(feature.title).parentElement;
      expect(card).toHaveClass('bg-white', 'p-6', 'rounded-xl', 'shadow-md');
      expect(card?.getAttribute("key") === "0");

      // Verify the icon container
      const iconContainer = screen.getByText(feature.title).previousElementSibling;
      expect(iconContainer).toHaveClass('w-12', 'h-12', feature.bgColor, 'rounded-lg', 'flex', 'items-center', 'justify-center', 'mb-4');

      // Verify the icon
      const icon = screen.getByTestId(feature.iconTestId);
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('w-6', 'h-6', feature.iconColor);

      // Verify the title
      const title = screen.getByText(feature.title);
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-800', 'mb-2');

      // Verify the description
      const description = screen.getByText(feature.description);
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('text-gray-600');
    });

    // Verify that exactly three feature cards are rendered
    const cards = screen.getAllByText(/Color Customization|Easy Download|Real-time Updates/);
    expect(cards).toHaveLength(3);
  });
});