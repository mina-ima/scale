import { saveImageWithRetry } from './imageUtils';

describe('saveImageWithRetry', () => {
  it('should save the image successfully on the first attempt', async () => {
    const mockBlob = new Blob();
    const mockFileName = 'test.jpg';
    const mockSaveFunction = vi.fn(() => Promise.resolve());

    await expect(
      saveImageWithRetry(mockBlob, mockFileName, mockSaveFunction)
    ).resolves.toBeUndefined();
    expect(mockSaveFunction).toHaveBeenCalledTimes(1);
  });

  it('should retry saving the image with reduced quality on failure', async () => {
    const mockBlob = new Blob();
    const mockFileName = 'test.jpg';
    const mockSaveFunction = vi
      .fn()
      .mockImplementationOnce(() => Promise.reject(new Error('Save failed')))
      .mockImplementationOnce(() => Promise.resolve());
    const mockReduceQuality = vi.fn(() => new Blob());

    await expect(
      saveImageWithRetry(
        mockBlob,
        mockFileName,
        mockSaveFunction,
        mockReduceQuality
      )
    ).resolves.toBeUndefined();
    expect(mockSaveFunction).toHaveBeenCalledTimes(2);
    expect(mockReduceQuality).toHaveBeenCalledTimes(1);
  });

  it('should retry saving the image with reduced resolution on further failure', async () => {
    const mockBlob = new Blob();
    const mockFileName = 'test.jpg';
    const mockSaveFunction = vi
      .fn()
      .mockImplementationOnce(() => Promise.reject(new Error('Save failed')))
      .mockImplementationOnce(() =>
        Promise.reject(new Error('Save failed again'))
      )
      .mockImplementationOnce(() => Promise.resolve());
    const mockReduceQuality = vi.fn(() => new Blob());
    const mockReduceResolution = vi.fn(() => new Blob());

    await expect(
      saveImageWithRetry(
        mockBlob,
        mockFileName,
        mockSaveFunction,
        mockReduceQuality,
        mockReduceResolution
      )
    ).resolves.toBeUndefined();
    expect(mockSaveFunction).toHaveBeenCalledTimes(3);
    expect(mockReduceQuality).toHaveBeenCalledTimes(1);
    expect(mockReduceResolution).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if all retry attempts fail', async () => {
    const mockBlob = new Blob();
    const mockFileName = 'test.jpg';
    const mockSaveFunction = vi.fn(() =>
      Promise.reject(new Error('Save failed'))
    );
    const mockReduceQuality = vi.fn(() => new Blob());
    const mockReduceResolution = vi.fn(() => new Blob());

    await expect(
      saveImageWithRetry(
        mockBlob,
        mockFileName,
        mockSaveFunction,
        mockReduceQuality,
        mockReduceResolution
      )
    ).rejects.toThrow('Save failed');
    expect(mockSaveFunction).toHaveBeenCalledTimes(3);
    expect(mockReduceQuality).toHaveBeenCalledTimes(1);
    expect(mockReduceResolution).toHaveBeenCalledTimes(1);
  });
});
