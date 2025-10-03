interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: {
    description: string;
    accept: { [key: string]: string[] };
  }[];
}

interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: Blob): Promise<void>;
  close(): Promise<void>;
}

interface Window {
  showSaveFilePicker(
    options?: SaveFilePickerOptions
  ): Promise<FileSystemFileHandle>;
}
