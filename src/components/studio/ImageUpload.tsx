import { useState, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon, X, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (files: File[]) => void;
}

interface UploadedFile {
  file: File;
  preview: string;
  quality: number;
}

const calculateImageQuality = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const aspectRatio = width / height;
      const megapixels = (width * height) / 1000000;

      let score = 0;

      if (megapixels >= 2) score += 30;
      else if (megapixels >= 1) score += 20;
      else score += 10;

      if (width >= 1920 && height >= 1080) score += 30;
      else if (width >= 1280 && height >= 720) score += 20;
      else score += 10;

      if (aspectRatio >= 0.5 && aspectRatio <= 2) score += 20;
      else score += 10;

      if (file.size < 10 * 1024 * 1024) score += 20;
      else if (file.size < 20 * 1024 * 1024) score += 10;

      URL.revokeObjectURL(url);
      resolve(Math.min(score, 100));
    };

    img.src = url;
  });
};

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const uploadedFiles: UploadedFile[] = [];

    for (const file of fileArray) {
      if (file.type.startsWith('image/')) {
        const quality = await calculateImageQuality(file);
        uploadedFiles.push({
          file,
          preview: URL.createObjectURL(file),
          quality,
        });
      }
    }

    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleConfirm = () => {
    if (files.length > 0) {
      onUpload(files.map((f) => f.file));
      files.forEach((f) => URL.revokeObjectURL(f.preview));
      setFiles([]);
    }
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return 'text-green-400';
    if (quality >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getQualityLabel = (quality: number) => {
    if (quality >= 80) return 'Excellent';
    if (quality >= 60) return 'Good';
    return 'Fair';
  };

  const getQualityIcon = (quality: number) => {
    if (quality >= 80) return CheckCircle;
    if (quality >= 60) return Info;
    return AlertCircle;
  };

  return (
    <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="text-blue-400" size={20} />
          <h3 className="text-white font-medium">Upload Images</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Info size={14} />
          <span>JPG, PNG, AVIF, WEBP</span>
        </div>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        <div className="text-center">
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Upload className="text-blue-400" size={24} />
              <span className="text-sm text-gray-300">Gallery</span>
            </button>
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Camera className="text-blue-400" size={24} />
              <span className="text-sm text-gray-300">Camera</span>
            </button>
          </div>
          <p className="text-gray-400 text-sm">or drag and drop images here</p>
          <p className="text-gray-500 text-xs mt-1">Maximum 10MB per image</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/avif,image/webp"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-300">{files.length} image{files.length > 1 ? 's' : ''} selected</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {files.map((file, index) => {
              const QualityIcon = getQualityIcon(file.quality);
              return (
                <div key={index} className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  <img
                    src={file.preview}
                    alt={`Upload ${index + 1}`}
                    className="w-full aspect-video object-cover"
                  />
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 p-1 bg-brand hover:bg-brand/90 rounded-full transition-colors"
                  >
                    <X size={14} className="text-white" />
                  </button>
                  <div className="p-2 bg-gray-900/80 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 truncate flex-1 mr-2">
                        {file.file.name}
                      </span>
                      <div className={`flex items-center gap-1 ${getQualityColor(file.quality)}`}>
                        <QualityIcon size={12} />
                        <span className="text-xs font-medium">{getQualityLabel(file.quality)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
            <div className="flex gap-2 text-xs text-blue-300">
              <Info size={14} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Tips for best results:</p>
                <ul className="list-disc list-inside space-y-0.5 text-blue-300/80">
                  <li>Use high-resolution images (1920x1080 or higher)</li>
                  <li>Ensure good lighting and clear subjects</li>
                  <li>Avoid heavily compressed images</li>
                  <li>Keep file size under 10MB</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Confirm Upload
          </button>
        </div>
      )}
    </div>
  );
}
