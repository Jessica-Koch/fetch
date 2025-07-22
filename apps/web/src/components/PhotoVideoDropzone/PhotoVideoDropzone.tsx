import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

type PhotoVideoDropzoneProps = {
  value: File[];
  onChange: (files: File[]) => void;
  minFiles?: number;
  maxFiles?: number;
  required?: boolean;
  error?: string;
};

export function PhotoVideoDropzone({
  value = [],
  onChange,
  minFiles = 5,
  maxFiles = 12,
  required = true,
  error,
}: PhotoVideoDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Add new files to current, but trim to maxFiles
      const allFiles = [...value, ...acceptedFiles].slice(0, maxFiles);
      onChange(allFiles);
    },
    [onChange, value, maxFiles]
  );

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: { 'image/*': [], 'video/*': [] },
    onDrop,
    multiple: true,
    maxFiles,
  });

  // Helper: Remove a file by index
  const removeFile = (i: number) => {
    const next = value.slice();
    next.splice(i, 1);
    onChange(next);
  };

  const showError =
    (required && value.length < minFiles) ||
    (fileRejections && fileRejections.length > 0) ||
    error;

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #ff6f91',
          padding: 24,
          textAlign: 'center',
          borderRadius: 12,
          background: '#fff5fa',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <div style={{ fontWeight: 600, marginBottom: 6 }}>
          Drag & drop photos/videos, or click to select files
        </div>
        <div style={{ fontSize: 13, color: '#b3005e' }}>
          <span>
            Upload <b>at least 5</b> clear photos or videos showing{' '}
            <b>indoor and outdoor spaces</b> of your home. <br />
            (Max {maxFiles} files. Accepted: images & videos)
          </span>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        {value.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginBottom: 8,
            }}
          >
            {value.map((file, i) => {
              const url = URL.createObjectURL(file);
              const isImage = file.type.startsWith('image/');
              const isVideo = file.type.startsWith('video/');
              return (
                <div key={i} style={{ position: 'relative', width: 82 }}>
                  {isImage && (
                    <img
                      src={url}
                      alt={file.name}
                      style={{
                        width: 82,
                        height: 82,
                        objectFit: 'cover',
                        borderRadius: 7,
                        border: '1px solid #eee',
                        background: '#fafafa',
                      }}
                    />
                  )}
                  {isVideo && (
                    <video
                      src={url}
                      style={{
                        width: 82,
                        height: 82,
                        objectFit: 'cover',
                        borderRadius: 7,
                        border: '1px solid #eee',
                        background: '#fafafa',
                      }}
                      controls={false}
                      muted
                    />
                  )}
                  <button
                    type='button'
                    aria-label='Remove'
                    onClick={() => removeFile(i)}
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      background: '#ff1e56',
                      border: 'none',
                      borderRadius: '50%',
                      color: '#fff',
                      width: 20,
                      height: 20,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px #0001',
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {showError && (
          <div style={{ color: 'crimson', marginTop: 6, fontWeight: 500 }}>
            {fileRejections && fileRejections.length > 0
              ? 'Some files are not supported (only images/videos).'
              : error ||
                `At least ${minFiles} photos or videos are required (showing indoor and outdoor space).`}
          </div>
        )}
      </div>
    </div>
  );
}
