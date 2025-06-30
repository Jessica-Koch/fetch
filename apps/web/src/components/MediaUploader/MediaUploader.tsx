import React, { useRef, useState } from 'react';

type MediaFile = {
  file: File;
  preview: string;
  uploading: boolean;
  progress: number;
  error?: string;
};

interface MediaUploaderProps {
  onChange: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSizeMB?: number;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onChange,
  accept = 'image/*,video/*',
  maxFiles = 5,
  maxSizeMB = 20,
}) => {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newMedia: MediaFile[] = [];

    fileArray.forEach((file) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        newMedia.push({
          file,
          preview: '',
          uploading: false,
          progress: 0,
          error: `File too large (max ${maxSizeMB} MB)`,
        });
        return;
      }
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        newMedia.push({
          file,
          preview: '',
          uploading: false,
          progress: 0,
          error: 'Unsupported file type',
        });
        return;
      }

      newMedia.push({
        file,
        preview: URL.createObjectURL(file),
        uploading: false,
        progress: 0,
      });
    });

    setMedia((prev) => {
      const all = [...prev, ...newMedia].slice(0, maxFiles);
      onChange(all.filter((f) => !f.error).map((f) => f.file));
      return all;
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (idx: number) => {
    setMedia((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      onChange(updated.filter((f) => !f.error).map((f) => f.file));
      return updated;
    });
  };

  // You can simulate upload/progress here if you want

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={onDrop}
      style={{
        border: dragActive ? '2px solid #7b61ff' : '2px dashed #aaa',
        borderRadius: 10,
        padding: 20,
        background: dragActive ? '#f4f2ff' : '#f9f9f9',
        cursor: 'pointer',
        marginBottom: 20,
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type='file'
        accept={accept}
        multiple
        style={{ display: 'none' }}
        onChange={onInputChange}
      />
      <div style={{ textAlign: 'center', color: '#777' }}>
        <strong>Drag & drop images or videos here</strong>
        <br />
        <span>
          or click to browse (max {maxFiles} files, {maxSizeMB}MB each)
        </span>
      </div>

      {/* Previews */}
      {media.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 16,
            marginTop: 20,
          }}
        >
          {media.map((file, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid #eee',
                borderRadius: 8,
                background: '#fff',
                padding: 8,
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <button
                type='button'
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  border: 'none',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  color: '#fff',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
                aria-label='Remove'
              >
                ×
              </button>
              {file.error ? (
                <div style={{ color: '#e00', fontSize: 12 }}>{file.error}</div>
              ) : file.file.type.startsWith('image/') ? (
                <img
                  src={file.preview}
                  alt={file.file.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 80,
                    borderRadius: 4,
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <video
                  src={file.preview}
                  controls
                  style={{
                    maxWidth: '100%',
                    maxHeight: 80,
                    borderRadius: 4,
                    background: '#222',
                  }}
                />
              )}
              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: '#444',
                  wordBreak: 'break-all',
                }}
              >
                {file.file.name}
              </div>
              {/* (Optional) Progress bar if you have uploads */}
              {/* file.uploading && (
                <div style={{ width: '100%', height: 4, background: '#eee', borderRadius: 2, marginTop: 6 }}>
                  <div style={{
                    width: `${file.progress}%`,
                    height: '100%',
                    background: '#7b61ff',
                    borderRadius: 2,
                    transition: 'width 0.2s',
                  }} />
                </div>
              ) */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
