import { useRef } from "react";

interface UploadBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  onFileChange?: (files: FileList | null) => void;
}

export function UploadBox({ label = "Choose file", onFileChange, ...props }: UploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="flex h-32 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/50 p-4 text-center"
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => onFileChange?.(e.target.files)}
        className="hidden"
        {...props}
      />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

export default UploadBox;
