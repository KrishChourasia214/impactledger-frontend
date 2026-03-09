import { useState, useRef } from 'react'
import { Upload, Camera, X, Image } from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn, getUserId } from '@/utils/cn'
import { receiptAPI } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export default function ReceiptUploader({ onUploadComplete }) {
  const { user } = useAuth()
  const [dragActive, setDragActive] = useState(false)
  const [previews, setPreviews] = useState([])
  const fileInputRef = useRef(null)

  // Process selected files
  const handleFiles = (files) => {
    const newPreviews = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      preview: URL.createObjectURL(file),
      status: 'ready',
    }))
    setPreviews((prev) => [...prev, ...newPreviews])
  }

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  // Remove a file from the list
  const removeFile = (id) => {
    setPreviews((prev) => prev.filter((p) => p.id !== id))
  }

  // Upload all files via API
  const handleUploadAll = async () => {
    const ngoId = getUserId(user)
    if (!ngoId) {
      toast.error('User session not found. Please login again.')
      return
    }

    // Mark all as uploading
    setPreviews((prev) => prev.map((p) => ({ ...p, status: 'uploading' })))

    const results = await Promise.allSettled(
      previews.map(async (p) => {
        // Per API reference: upload-receipt expects 'file' (required) + 'ngoId' (required)
        const formData = new FormData()
        formData.append('file', p.file)
        formData.append('ngoId', ngoId)
        try {
          const res = await receiptAPI.upload(formData)
          return { id: p.id, success: true, data: res }
        } catch (err) {
          return { id: p.id, success: false, error: err }
        }
      })
    )

    // Update statuses based on results
    setPreviews((prev) =>
      prev.map((p) => {
        const result = results.find((r) => r.value?.id === p.id)
        if (result?.status === 'fulfilled' && result.value?.success) {
          return { ...p, status: 'processed' }
        }
        return { ...p, status: 'failed' }
      })
    )

    const successCount = results.filter((r) => r.status === 'fulfilled' && r.value?.success).length
    const failCount = results.length - successCount

    if (successCount > 0) {
      toast.success(`${successCount} receipt${successCount > 1 ? 's' : ''} uploaded successfully!`)
    }
    if (failCount > 0) {
      toast.error(`${failCount} receipt${failCount > 1 ? 's' : ''} failed to upload`)
    }

    // Notify parent to refresh
    if (onUploadComplete) {
      onUploadComplete()
    }
  }

  return (
    <div className="space-y-6">

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragActive(false)}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200',
          dragActive
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-slate-300 hover:border-primary/50 hover:bg-slate-50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors',
            dragActive ? 'bg-primary/10' : 'bg-slate-100'
          )}>
            <Upload className={cn('w-8 h-8', dragActive ? 'text-primary' : 'text-text-muted')} />
          </div>
          <div>
            <p className="text-lg font-semibold text-text-primary">
              {dragActive ? 'Drop your files here' : 'Drag & drop receipt images'}
            </p>
            <p className="text-sm text-text-muted mt-1">
              or click to browse • PNG, JPG, HEIC up to 5MB each
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" icon={Image} onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
              Browse Files
            </Button>
            <Button variant="ghost" size="sm" icon={Camera} onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
              Take Photo
            </Button>
          </div>
        </div>
      </div>

      {/* File Previews */}
      {previews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-text-primary">
              {previews.length} file{previews.length > 1 ? 's' : ''} selected
            </h4>
            <Button size="sm" onClick={handleUploadAll}>
              Upload & Process All
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {previews.map((file) => (
              <div key={file.id} className="relative bg-white rounded-xl border border-slate-200 overflow-hidden group">
                <img src={file.preview} alt={file.name} className="w-full h-40 object-cover" />

                {file.status === 'uploading' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-white text-sm font-medium">Processing with AI...</span>
                    </div>
                  </div>
                )}

                {file.status === 'processed' && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-success text-white text-xs font-bold px-2 py-1 rounded-lg">✓ Processed</span>
                  </div>
                )}

                {file.status === 'failed' && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">✗ Failed</span>
                  </div>
                )}

                {file.status === 'ready' && (
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-50"
                  >
                    <X className="w-4 h-4 text-error" />
                  </button>
                )}

                <div className="p-3">
                  <p className="text-sm font-medium text-text-primary truncate">{file.name}</p>
                  <p className="text-xs text-text-muted">{file.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}