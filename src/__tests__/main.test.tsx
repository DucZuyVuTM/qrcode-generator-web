import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { createRoot } from 'react-dom/client';

// Mock react-dom/client
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
    unmount: vi.fn(),
  })),
}));

describe('Main Entry Point', () => {
  let originalGetElementById: typeof document.getElementById;
  let mockRootElement: HTMLDivElement;

  beforeAll(() => {
    // Save original method
    originalGetElementById = document.getElementById;
    
    // Create a real mock element
    mockRootElement = document.createElement('div');
    mockRootElement.id = 'root';
    
    // Mock getElementById
    document.getElementById = vi.fn((id: string) => {
      if (id === 'root') {
        return mockRootElement;
      }
      return originalGetElementById.call(document, id);
    });
  });

  afterAll(() => {
    // Restore original method
    document.getElementById = originalGetElementById;
  });

  it('should call createRoot with root element when main is imported', async () => {
    // Clear previous calls
    vi.clearAllMocks();
    
    // Dynamically import to trigger the code
    await import('../main');

    // Verify createRoot was called
    expect(createRoot).toHaveBeenCalled();
    
    // Verify it was called with an element
    const callArgs = vi.mocked(createRoot).mock.calls[0];
    expect(callArgs[0]).toBeTruthy();
  });

  it('should call render on the created root', async () => {
    const mockRender = vi.fn();
    vi.mocked(createRoot).mockReturnValue({
      render: mockRender,
      unmount: vi.fn(),
    });

    // Re-import to trigger again
    vi.resetModules();
    await import('../main');

    // Verify render was called
    expect(mockRender).toHaveBeenCalled();
  });
});