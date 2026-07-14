import { SafeImage } from "@/components/ui/safe-image"

interface DocumentPreviewProps {
  label: string
  imageUrl: string
  fileName: string
  fileSize: string
}

export function DocumentPreview({ label, imageUrl, fileName, fileSize }: DocumentPreviewProps) {
  return (
    <div>
      <label className="text-sm text-gray-600 block mb-2">{label}</label>
      <div className="border rounded-lg p-4">
        <SafeImage src={imageUrl} alt={label} width={400} height={192} className="w-full h-48 object-cover rounded mb-2" />
        <p className="text-sm font-medium">{fileName}</p>
        <p className="text-xs text-gray-500">{fileSize}</p>
        <div className="flex gap-2 mt-3">
          <a 
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 text-center"
          >
            View
          </a>
          <a 
            href={imageUrl}
            download={fileName}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 text-center"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  )
}
