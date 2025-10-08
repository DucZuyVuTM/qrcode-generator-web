import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ColorPresets from '../components/ColorPresets';

describe('ColorPresets Component', () => {
  let onPresetSelectMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onPresetSelectMock = vi.fn();
  });

  it('should render color presets label', () => {
    render(<ColorPresets onPresetSelect={onPresetSelectMock} />);

    expect(screen.getByText('Color Presets')).toBeInTheDocument();
  });

  it('should render all 6 preset buttons', () => {
    render(<ColorPresets onPresetSelect={onPresetSelectMock} />);

    const presetNames = ['Classic', 'Ocean', 'Forest', 'Sunset', 'Purple', 'Amber'];
    
    presetNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });

    // Check that we have exactly 6 buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(6);
  });

  it('should render color preview circles for each preset', () => {
    const { container } = render(<ColorPresets onPresetSelect={onPresetSelectMock} />);

    // Each preset has 2 color circles (fg and bg)
    const colorCircles = container.querySelectorAll('.w-4.h-4.rounded-full');
    expect(colorCircles).toHaveLength(12); // 6 presets × 2 circles
  });

  it('should call onPresetSelect with correct colors when Classic preset is clicked', () => {
    render(<ColorPresets onPresetSelect={onPresetSelectMock} />);

    const classicButton = screen.getByText('Classic').closest('button');
    fireEvent.click(classicButton!);

    expect(onPresetSelectMock).toHaveBeenCalledWith('#000000', '#ffffff');
    expect(onPresetSelectMock).toHaveBeenCalledTimes(1);
  });

  it('should call onPresetSelect with correct colors when Ocean preset is clicked', () => {
    render(<ColorPresets onPresetSelect={onPresetSelectMock} />);

    const oceanButton = screen.getByText('Ocean').closest('button');
    fireEvent.click(oceanButton!);

    expect(onPresetSelectMock).toHaveBeenCalledWith('#1e3a8a', '#dbeafe');
    expect(onPresetSelectMock).toHaveBeenCalledTimes(1);
  });

  it('should call onPresetSelect with correct colors when Forest preset is clicked', () => {
    render(<ColorPresets onPresetSelect={onPresetSelectMock} />);

    const forestButton = screen.getByText('Forest').closest('button');
    fireEvent.click(forestButton!);

    expect(onPresetSelectMock).toHaveBeenCalledWith('#166534', '#dcfce7');
  });

  it('should call onPresetSelect with correct colors when Sunset preset is clicked', () => {
    render(<ColorPresets onPresetSelect={onPresetSelectMock} />);

    const sunsetButton = screen.getByText('Sunset').closest('button');
    fireEvent.click(sunsetButton!);

    expect(onPresetSelectMock).toHaveBeenCalledWith('#dc2626', '#fef2f2');
  });

  it('should call onPresetSelect with correct colors when Purple preset is clicked', () => {
    render(<ColorPresets onPresetSelect={onPresetSelectMock} />);

    const purpleButton = screen.getByText('Purple').closest('button');
    fireEvent.click(purpleButton!);

    expect(onPresetSelectMock).toHaveBeenCalledWith('#7c3aed', '#f3e8ff');
  });

  it('should call onPresetSelect with correct colors when Amber preset is clicked', () => {
    render(<ColorPresets onPresetSelect={onPresetSelectMock} />);

    const amberButton = screen.getByText('Amber').closest('button');
    fireEvent.click(amberButton!);

    expect(onPresetSelectMock).toHaveBeenCalledWith('#d97706', '#fef3c7');
  });

  it('should apply correct inline styles to color circles', () => {
    render(<ColorPresets onPresetSelect={onPresetSelectMock} />);

    // Find the Amber button using getByText and its closest button
    const amberButton = screen.getByText('Amber').closest('button');
    if (!amberButton) throw new Error('Amber button not found');

    // Query color circles within the Amber button
    const colorCircles = amberButton.querySelectorAll('.w-4.h-4.rounded-full');
    
    expect(colorCircles.length).toBe(2); // Ensure 2 circles are found
    expect(colorCircles[0]).toHaveStyle({ backgroundColor: '#d97706' }); // Foreground
    expect(colorCircles[1]).toHaveStyle({ backgroundColor: '#fef3c7' }); // Background
  });

  it('should have proper CSS classes for styling', () => {
    render(<ColorPresets onPresetSelect={onPresetSelectMock} />);

    const button = screen.getByText('Classic').closest('button');
    
    expect(button).toHaveClass('p-3');
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-gray-200');
    expect(button).toHaveClass('rounded-lg');
    expect(button).toHaveClass('hover:border-blue-300');
  });

  it('should allow multiple preset selections', () => {
    render(<ColorPresets onPresetSelect={onPresetSelectMock} />);

    const classicButton = screen.getByText('Classic').closest('button');
    const oceanButton = screen.getByText('Ocean').closest('button');
    const forestButton = screen.getByText('Forest').closest('button');

    fireEvent.click(classicButton!);
    fireEvent.click(oceanButton!);
    fireEvent.click(forestButton!);

    expect(onPresetSelectMock).toHaveBeenCalledTimes(3);
    expect(onPresetSelectMock).toHaveBeenNthCalledWith(1, '#000000', '#ffffff');
    expect(onPresetSelectMock).toHaveBeenNthCalledWith(2, '#1e3a8a', '#dbeafe');
    expect(onPresetSelectMock).toHaveBeenNthCalledWith(3, '#166534', '#dcfce7');
  });
});