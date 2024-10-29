import { ImageIcon } from "lucide-react";

export const UploadPlaceholder = () => (
    <div className="text-center">
        <ImageIcon className="mx-auto h-12 w-12 text-primary" />
        <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
    </div>
);