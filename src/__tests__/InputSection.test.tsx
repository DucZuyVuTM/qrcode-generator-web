import { describe, beforeEach, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputSection from '../components/InputSection';

// Mock lucide-react icon to avoid rendering issues
vi.mock('lucide-react', () => ({
  Type: () => <svg data-testid="mock-icon" />,
}));

describe('InputSection Component', () => {
  let setTextMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    setTextMock = vi.fn();
  });

  it('should call setText when textarea value changes', () => {
    render(<InputSection text="" setText={setTextMock} />);

    const textarea = screen.getByPlaceholderText('Enter URL, text, or any content...');
    const newText = 'https://example.com';

    fireEvent.change(textarea, { target: { value: newText } });

    // Check if setText is called with the new value
    expect(setTextMock).toHaveBeenCalledWith(newText);
    expect(setTextMock).toHaveBeenCalledTimes(1);
  });
});