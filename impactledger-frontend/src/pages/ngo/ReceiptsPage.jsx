import { useState, useEffect } from 'react'
import {
  LayoutDashboard, User, Upload, FileText, Mic, FolderOpen,
  Bell, CheckCircle, Clock, AlertCircle
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import StatCard from '@/components/ui/StatCard'
import Spinner from '@/components/ui/Spinner'
import ReceiptUploader from '@/components/ngo/ReceiptUploader'
import ReceiptCard from '@/components/ngo/ReceiptCard'
import { useAuth } from '@/hooks/useAuth'
import { receiptAPI } from '@/services/api'
import { getUserId } from '@/utils/cn'
import toast from 'react-hot-toast'

const sidebarItems = [
  { label: 'Dashboard', path: '/ngo/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', path: '/ngo/profile', icon: User },
  { label: 'Upload Receipts', path: '/ngo/receipts', icon: Upload },
  { label: 'Compliance', path: '/ngo/compliance', icon: FileText },
  { label: 'Voice Input', path: '/ngo/voice', icon: Mic },
  { label: 'My Projects', path: '/ngo/projects', icon: FolderOpen },
  { label: 'Notifications', path: '/ngo/notifications', icon: Bell },
]

export default function ReceiptsPage() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReceipts = async (signal) => {
    const ngoId = getUserId(user)
    if (!ngoId) {
      setLoading(false)
      return
    }
    try {
      const res = await receiptAPI.getAll(ngoId, signal ? { signal } : {})
      const data = res?.data || res?.receipts || res
      setReceipts(Array.isArray(data) ? data : [])
    } catch (err) {
      if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') return
      toast.error(err?.message || 'Failed to load receipts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const ngoId = getUserId(user)
    if (!ngoId) {
      setLoading(false)
      return
    }
    const controller = new AbortController()
    fetchReceipts(controller.signal)
    return () => controller.abort()
  }, [user])

  // API returns `processingStatus` (may be uppercase e.g. PROCESSING); normalize for comparison
  const getStatus = (r) => {
    const s = r.processingStatus || r.status || 'pending'
    return typeof s === 'string' ? s.toLowerCase() : 'pending'
  }

  const filteredReceipts = filter === 'all'
    ? receipts
    : receipts.filter((r) => getStatus(r) === filter)

  const completedCount = receipts.filter((r) => getStatus(r) === 'completed').length
  const processingCount = receipts.filter((r) => getStatus(r) === 'processing').length
  const failedCount = receipts.filter((r) => getStatus(r) === 'failed').length

  const handleUploadSuccess = () => {
    const ngoId = getUserId(user)
    if (ngoId) fetchReceipts()
  }

  if (loading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} userType="ngo">
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="ngo">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Upload Receipts</h1>
        <p className="text-text-secondary mt-1">
          Upload photos of handwritten receipts. Our AI will extract and structure the data automatically.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Receipts" value={receipts.length.toString()} icon={Upload} color="primary" />
        <StatCard title="Processed" value={completedCount.toString()} icon={CheckCircle} color="success" />
        <StatCard title="Processing" value={processingCount.toString()} icon={Clock} color="warning" />
        <StatCard title="Failed" value={failedCount.toString()} icon={AlertCircle} color="warning" />
      </div>

      {/* Upload Area */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary">Upload New Receipts</h3>
            <Badge variant="accent">🤖 AI-Powered OCR</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ReceiptUploader onUploadComplete={handleUploadSuccess} />
        </CardContent>
      </Card>

      {/* Receipt History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary">Receipt History</h3>
            <div className="flex gap-2">
              {['all', 'completed', 'processing', 'failed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                    filter === f
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-text-muted hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredReceipts.map((receipt) => (
            <ReceiptCard key={receipt.receiptId || receipt.id || receipt._id} receipt={receipt} />
          ))}
          {filteredReceipts.length === 0 && (
            <div className="text-center py-12 text-text-muted">
              <Upload className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{receipts.length === 0 ? 'No receipts uploaded yet. Upload your first receipt above!' : 'No receipts found with this filter'}</p>
            </div>
          )}
        </CardContent>
      </Card>

    </DashboardLayout>
  )
}