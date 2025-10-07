import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ColorPresets from '../components/ColorPresets';

describe('ColorPresets Component', () => {
  let onPresetSelectMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onPresetSelectMock = vi.fn();
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