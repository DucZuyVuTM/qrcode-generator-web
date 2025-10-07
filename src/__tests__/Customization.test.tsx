import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Customization from '../components/Customization';

// Mock lucide-react icon
vi.mock('lucide-react', () => ({
  Palette: () => <svg data-testid="mock-palette-icon" />,
}));

describe('Customization Component', () => {
  let setForegroundColorMock: ReturnType<typeof vi.fn>;
  let setBackgroundColorMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    setForegroundColorMock = vi.fn();
    setBackgroundColorMock = vi.fn();
  });

  describe('Single Color Changes', () => {
    it('should call setForegroundColor when color picker changes', () => {
      render(
        <Customization
          foregroundColor="#000000"
          setForegroundColor={setForegroundColorMock}
          backgroundColor="#ffffff"
          setBackgroundColor={setBackgroundColorMock}
        />
      );

      const colorPicker = screen.getAllByDisplayValue('#000000')
        .find(input => input.getAttribute('type') === 'color') as HTMLInputElement;

      fireEvent.change(colorPicker, { target: { value: '#ff0000' } });

      expect(setForegroundColorMock).toHaveBeenCalledWith('#ff0000');
      expect(setForegroundColorMock).toHaveBeenCalledTimes(1);
    });

    it('should call setForegroundColor when text input changes', () => {
      render(
        <Customization
          foregroundColor="#000000"
          setForegroundColor={setForegroundColorMock}
          backgroundColor="#ffffff"
          setBackgroundColor={setBackgroundColorMock}
        />
      );

      const textInput = screen.getAllByDisplayValue('#000000')
        .find(input => input.getAttribute('type') === 'text') as HTMLInputElement;

      fireEvent.change(textInput, { target: { value: '#00ff00' } });

      expect(setForegroundColorMock).toHaveBeenCalledWith('#00ff00');
      expect(setForegroundColorMock).toHaveBeenCalledTimes(1);
    });

    it('should call setBackgroundColor when color picker changes', () => {
      render(
        <Customization
          foregroundColor="#000000"
          setForegroundColor={setForegroundColorMock}
          backgroundColor="#ffffff"
          setBackgroundColor={setBackgroundColorMock}
        />
      );

      const colorPicker = screen.getAllByDisplayValue('#ffffff')
        .find(input => input.getAttribute('type') === 'color') as HTMLInputElement;

      fireEvent.change(colorPicker, { target: { value: '#0000ff' } });

      expect(setBackgroundColorMock).toHaveBeenCalledWith('#0000ff');
      expect(setBackgroundColorMock).toHaveBeenCalledTimes(1);
    });

    it('should call setBackgroundColor when text input changes', () => {
      render(
        <Customization
          foregroundColor="#000000"
          setForegroundColor={setForegroundColorMock}
          backgroundColor="#ffffff"
          setBackgroundColor={setBackgroundColorMock}
        />
      );

      const textInput = screen.getAllByDisplayValue('#ffffff')
        .find(input => input.getAttribute('type') === 'text') as HTMLInputElement;

      fireEvent.change(textInput, { target: { value: '#ffff00' } });

      expect(setBackgroundColorMock).toHaveBeenCalledWith('#ffff00');
      expect(setBackgroundColorMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Multiple Color Changes', () => {
    it('should handle multiple color changes independently', () => {
      render(
        <Customization
          foregroundColor="#000000"
          setForegroundColor={setForegroundColorMock}
          backgroundColor="#ffffff"
          setBackgroundColor={setBackgroundColorMock}
        />
      );

      const fgTextInput = screen.getAllByDisplayValue('#000000')
        .find(input => input.getAttribute('type') === 'text') as HTMLInputElement;
      const bgTextInput = screen.getAllByDisplayValue('#ffffff')
        .find(input => input.getAttribute('type') === 'text') as HTMLInputElement;

      fireEvent.change(fgTextInput, { target: { value: '#111111' } });
      fireEvent.change(bgTextInput, { target: { value: '#222222' } });

      expect(setForegroundColorMock).toHaveBeenCalledWith('#111111');
      expect(setBackgroundColorMock).toHaveBeenCalledWith('#222222');
      expect(setForegroundColorMock).toHaveBeenCalledTimes(1);
      expect(setBackgroundColorMock).toHaveBeenCalledTimes(1);
    });

    it('should sync color picker and text input', () => {
      const { rerender } = render(
        <Customization
          foregroundColor="#000000"
          setForegroundColor={setForegroundColorMock}
          backgroundColor="#ffffff"
          setBackgroundColor={setBackgroundColorMock}
        />
      );

      const foregroundColorPicker = screen.getAllByDisplayValue('#000000')
        .find(input => input.getAttribute('type') === 'color') as HTMLInputElement;

      fireEvent.change(foregroundColorPicker, { target: { value: '#123456' } });

      const backgroundColorPicker = screen.getAllByDisplayValue('#ffffff')
        .find(input => input.getAttribute('type') === 'color') as HTMLInputElement;

      fireEvent.change(backgroundColorPicker, { target: { value: '#654321' } });

      expect(setForegroundColorMock).toHaveBeenCalledWith('#123456');
      expect(setBackgroundColorMock).toHaveBeenCalledWith('#654321');

      // Simulate parent updating the prop
      rerender(
        <Customization
          foregroundColor="#123456"
          setForegroundColor={setForegroundColorMock}
          backgroundColor="#654321"
          setBackgroundColor={setBackgroundColorMock}
        />
      );

      // Both inputs should now show the new color
      const updatedForegroundInputs = screen.getAllByDisplayValue('#123456');
      expect(updatedForegroundInputs).toHaveLength(2);

      // The same with background
      const updatedBackgroundInputs = screen.getAllByDisplayValue('#654321');
      expect(updatedBackgroundInputs).toHaveLength(2);
    });
  });
});