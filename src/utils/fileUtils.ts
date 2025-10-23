export type ItemKey = 'shinchou' | 'ashi' | 'te' | 'taijuu';

/**
 * Generates a formatted filename for a growth record image based on spec.
 * Format: hakattake_YYYY-MM-DD_[itemKey]_[value][unit].jpg
 */
export const generateFileName = (
  itemKey: ItemKey,
  value: number,
  unit: 'cm' | 'kg',
  dateISO: string
): string => {
  const date = new Date(dateISO);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  const formattedValue = value.toFixed(1);

  return `hakattake_${formattedDate}_${itemKey}_${formattedValue}${unit}.jpg`;
};

export const saveImageToDevice = async (
  blob: Blob,
  fileName: string
): Promise<void> => {
  if (
    'showSaveFilePicker' in window &&
    typeof window.showSaveFilePicker === 'function'
  ) {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: '画像ファイル',
            accept: { 'image/jpeg': ['.jpg', '.jpeg'] },
          },
        ],
      });
      const writableStream = await fileHandle.createWritable();
      await writableStream.write(blob);
      await writableStream.close();
      console.log(`File '${fileName}' saved via File System Access API.`);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('File save aborted by user.');
      } else {
        console.error('Error saving file via File System Access API:', error);
        // Fallback to download link if API fails for other reasons
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log(`File '${fileName}' downloaded via fallback.`);
      }
    }
  } else {
    // Fallback for browsers that do not support File System Access API
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(`File '${fileName}' downloaded via fallback.`);
  }
};
