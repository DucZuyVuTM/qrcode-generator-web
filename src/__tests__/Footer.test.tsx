import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Footer from '../components/Footer';

// Mock react-icons/fa to avoid rendering issues in tests
vi.mock('react-icons/fa', () => ({
  FaMobileAlt: ({ className }: { className: string }) => (
    <svg data-testid="mobile-icon" className={className} />
  ),
  FaEnvelope: ({ className }: { className: string }) => (
    <svg data-testid="envelope-icon" className={className} />
  ),
}));

describe('Footer Component', () => {
  it('renders correctly with all elements and styles', () => {
    render(<Footer />);

    // Verify the outer div
    const outerDiv = screen.getByText('8-905-721-27-49').parentElement?.parentElement?.parentElement;
    expect(outerDiv).toHaveClass('mx-8', 'mt-3', 'py-6');

    // Verify the container div
    const containerDiv = screen.getByText('8-905-721-27-49').parentElement?.parentElement;
    expect(containerDiv).toHaveClass('container', 'mx-auto', 'px-4', 'mb-2');

    // Verify the paragraph
    const paragraph = screen.getByText('8-905-721-27-49').parentElement;
    expect(paragraph).toHaveClass('text-center');

    // Verify the FaMobileAlt icon
    const mobileIcon = screen.getByTestId('mobile-icon');
    expect(mobileIcon).toBeInTheDocument();
    expect(mobileIcon).toHaveClass('inline', 'mr-1');

    // Verify the phone link
    const phoneLink = screen.getByText('8-905-721-27-49');
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink).toHaveAttribute('href', 'tel:+79057212749');
    expect(phoneLink).toHaveClass('text-black', 'hover:underline');

    // Verify the FaEnvelope icon
    const envelopeIcon = screen.getByTestId('envelope-icon');
    expect(envelopeIcon).toBeInTheDocument();
    expect(envelopeIcon).toHaveClass('inline', 'mr-1');

    // Verify the email link
    const emailLink = screen.getByText('duczuyvu12@gmail.com');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:duczuyvu12@gmail.com');
    expect(emailLink).toHaveClass('text-black', 'hover:underline');
  });
});