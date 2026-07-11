import React, { useRef, useState } from 'react';
import { Camera, X, Image as ImageIcon, Upload } from 'lucide-react';
import { supabase, hasSupabaseConfig } from '../services/supabaseClient';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  bucket?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

export const ImageUpload: React.FC<ImageUploadProps> = ({ images, onChange, maxImages = 4, bucket = 'observations' }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const remaining = maxImages - images.length;
    if (remaining <= 0) { toast.error(`Maximum ${maxImages} images allowed`); return; }

    const toProcess = Array.from(files).slice(0, remaining);
    setUploading(true);

    try {
      const newUrls: string[] = [];

      for (const file of toProcess) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          toast.error(`${file.name}: unsupported format. Use JPEG, PNG, or WebP.`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name}: file too large (max 5MB).`);
          continue;
        }

        if (hasSupabaseConfig) {
          const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name}`;
          const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: false });
          if (error) { toast.error(`Upload failed: ${error.message}`); continue; }
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
          newUrls.push(urlData.publicUrl);
        } else {
          const dataUrl = await fileToDataUrl(file);
          newUrls.push(dataUrl);
        }
      }

      if (newUrls.length > 0) {
        onChange([...images, ...newUrls]);
        toast.success(`${newUrls.length} photo${newUrls.length > 1 ? 's' : ''} added`);
      }
    } catch (err) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((src, i) => (
          <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
            <img src={src} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span className="text-[10px] mt-1 font-medium">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />

      {!hasSupabaseConfig && images.length > 0 && (
        <p className="text-[10px] text-amber-500">Demo mode: photos stored locally as base64. Connect Supabase Storage for production.</p>
      )}
    </div>
  );
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
