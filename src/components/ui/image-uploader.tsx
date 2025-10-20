import { Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Input } from './input';

interface ImageUploaderProps {
  value?: string;
  onChange: (value: string) => void;
  onError?: (error: string | null) => void;
  className?: string;
  size?: 'sm' | 'lg';
  placeholder?: string;
}

export function ImageUploader({
  value,
  onChange,
  onError,
  className = '',
  size = 'lg',
  placeholder,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'h-16 w-16',
    lg: 'h-20 w-20',
  };

  const iconSizes = {
    sm: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const borderClasses = {
    sm: 'border',
    lg: 'border-2 border-muted-foreground/25 border-dashed',
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError(null);
    onError?.(null);

    if (file.size > 100 * 1024) {
      const errorMsg =
        'Image must be under 100KB. Please choose a smaller file.';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Please select a valid image file (PNG, JPG, etc.).';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
    onError?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative">
        {value ? (
          <>
            <div
              className={`flex ${sizeClasses[size]} items-center justify-center overflow-hidden rounded-lg ${borderClasses[size]}`}
            >
              <img
                alt="Preview"
                className="h-full w-full object-cover"
                height={size === 'sm' ? 64 : 80}
                src={value}
                width={size === 'sm' ? 64 : 80}
              />
            </div>
            <button
              className="-top-2 -right-2 absolute z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-destructive/80 text-white shadow-sm hover:bg-destructive"
              onClick={handleRemove}
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          </>
        ) : (
          <div
            className={`flex ${sizeClasses[size]} items-center justify-center rounded-lg ${borderClasses[size]} ${size === 'lg' ? 'bg-muted/50' : ''}`}
          >
            <Upload className={`${iconSizes[size]} text-muted-foreground`} />
          </div>
        )}
        <Input
          accept="image/*"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          onChange={handleUpload}
          ref={fileInputRef}
          type="file"
        />
      </div>
      {(error || placeholder) && !value && (
        <p className="text-center text-muted-foreground text-sm">
          {placeholder}
        </p>
      )}
      {error && <p className="text-center text-destructive text-sm">{error}</p>}
    </div>
  );
}
