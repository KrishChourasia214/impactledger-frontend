import { Eye, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import toast from 'react-hot-toast'

export default function ReceiptCard({ receipt }) {
  // API returns `processingStatus` (may be uppercase); normalize for display
  const rawStatus = (receipt.processingStatus || receipt.status || 'pending')
  const normalizedStatus = typeof rawStatus === 'string' ? rawStatus.toLowerCase() : 'pending'

  // API returns extracted fields under `extractedData`; vendor per API ref (vendor_name as fallback)
  const extracted = receipt.extractedData || {}
  const vendor = extracted.vendor || extracted.vendor_name || receipt.vendor || null
  const amount = extracted.amount || receipt.amount || null
  const date = extracted.date || receipt.date || null
  const category = extracted.category || receipt.category || null
  const confidence = receipt.aiConfidence ?? receipt.confidence ?? null
  const imageUrl = receipt.imageUrl || receipt.thumbnail || null

  // Status configuration
  const statusConfig = {
    completed: { icon: CheckCircle, label: 'Processed', variant: 'success' },
    processing: { icon: Clock, label: 'Processing', variant: 'warning' },
    failed: { icon: AlertCircle, label: 'Failed', variant: 'danger' },
    pending: { icon: Clock, label: 'Pending', variant: 'default' },
  }

  const status = statusConfig[normalizedStatus] || statusConfig.pending
  const StatusIcon = status.icon

  const handlePreview = () => {
    if (!imageUrl) {
      toast.error('No image available for preview')
      return
    }
    window.open(imageUrl, '_blank', 'noopener,noreferrer')
  }

  const handleDownload = () => {
    if (!imageUrl) {
      toast.error('No image available to download')
      return
    }
    // Use anchor-tag download instead of fetch() to avoid S3 CORS restrictions.
    // The pre-signed URL already grants access — the browser handles it natively.
    const filename = imageUrl.split('/').pop()?.split('?')[0] || `receipt-${receipt.receiptId || receipt._id || 'file'}`
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = filename
    a.target = '_blank'          // fallback: opens in new tab if download attr is blocked
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">

        {/* Thumbnail */}
        <div className="w-24 h-24 shrink-0 bg-slate-100 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Receipt"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl">🧾</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-text-primary text-sm">
                {vendor || 'Processing...'}
              </p>
              <p className="text-lg font-bold text-primary mt-0.5">
                {amount != null ? `₹${Number(amount).toLocaleString()}` : '—'}
              </p>
            </div>
            <Badge variant={status.variant}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </Badge>
          </div>

          <div className="flex items-center justify-between mt-3">
            {/* Date and category */}
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <span>{date || 'Date pending'}</span>
              <span>•</span>
              <span>{category || 'Uncategorized'}</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-1">
              <button
                title="Preview"
                onClick={handlePreview}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-text-muted" />
              </button>
              <button
                title="Download"
                onClick={handleDownload}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-text-muted" />
              </button>
            </div>
          </div>

          {/* Confidence bar */}
          {confidence != null && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-success rounded-full h-1.5"
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>
              <span className="text-xs text-text-muted">
                {Math.round(confidence * 100)}% confidence
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}