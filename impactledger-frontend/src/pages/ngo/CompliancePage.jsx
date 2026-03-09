import { useState, useEffect } from 'react'
import {
  LayoutDashboard, User, Upload, FileText, Mic, FolderOpen,
  Bell, Download, Eye, CheckCircle, Sparkles, FileCheck, Edit3
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import StatCard from '@/components/ui/StatCard'
import Spinner from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { receiptAPI, complianceAPI } from '@/services/api'
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

export default function CompliancePage() {
  const { user } = useAuth()
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [generatedForm, setGeneratedForm] = useState(null)
  const [generatedFormId, setGeneratedFormId] = useState(null)
  const [receipts, setReceipts] = useState([])
  const [previousForms, setPreviousForms] = useState([])
  const [selectedReceipts, setSelectedReceipts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    const ngoId = getUserId(user)
    if (!ngoId) {
      setLoading(false)
      return
    }
    const controller = new AbortController()
    const signal = controller.signal
    const fetchData = async () => {
      try {
        const [receiptRes, formsRes] = await Promise.all([
          receiptAPI.getAll(ngoId, { signal }),
          complianceAPI.getForms(ngoId, { signal }).catch(() => null),
        ])
        const receiptData = receiptRes?.data || receiptRes?.receipts || receiptRes
        const receiptsList = Array.isArray(receiptData)
          ? receiptData.filter((r) => {
              const s = r.processingStatus || r.status || ''
              return (typeof s === 'string' ? s.toLowerCase() : s) === 'completed'
            })
          : []
        setReceipts(receiptsList)
        if (formsRes) {
          const formsData = formsRes?.data || formsRes?.forms || formsRes
          setPreviousForms(Array.isArray(formsData) ? formsData : [])
        }
      } catch (err) {
        if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') return
        toast.error(err?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    return () => controller.abort()
  }, [user])

  const handleGenerate = async () => {
    if (selectedReceipts.length === 0) {
      toast.error('Please select at least one receipt')
      return
    }
    setGenerating(true)
    try {
      const res = await complianceAPI.generateForm10BD({
        receiptIds: selectedReceipts,
        ngoId: getUserId(user),
        financialYear: '2024-25',
      })
      const formData = res?.data || res
      setGeneratedForm(formData)
      setGeneratedFormId(formData?.formId || null)
      setGenerated(true)
      toast.success('Form 10BD generated successfully!')
    } catch (err) {
      toast.error(err?.message || 'Failed to generate form')
    } finally {
      setGenerating(false)
    }
  }

  const toggleReceipt = (id) => {
    setSelectedReceipts((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  // Helper to get the receipt's correct ID field (API returns receiptId)
  const getReceiptId = (r) => r.receiptId || r.id || r._id

  const totalAmount = receipts
    .filter((r) => selectedReceipts.includes(getReceiptId(r)))
    .reduce((sum, r) => sum + (r.extractedData?.amount || r.amount || 0), 0)

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
        <h1 className="text-3xl font-bold text-text-primary">Compliance & Forms</h1>
        <p className="text-text-secondary mt-1">
          Generate Form 10BD and other compliance documents using AI in minutes, not hours.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Forms Generated" value={previousForms.length.toString()} icon={FileText} color="primary" />
        <StatCard title="Receipts Available" value={receipts.length.toString()} icon={CheckCircle} color="success" />
        <StatCard title="AI Powered" value="✓" icon={Sparkles} color="accent" />
        <StatCard title="Pending Forms" value={previousForms.filter(f => f.status === 'pending' || f.status === 'draft').length.toString()} icon={FileCheck} color="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Generate Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">Generate Form 10BD</h3>
                <Badge variant="accent">🤖 AI-Powered</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Financial Year & Form Type */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-primary">Financial Year</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>2024-25</option>
                    <option>2023-24</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-primary">Form Type</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>Form 10BD</option>
                    <option>Form 10BE</option>
                    <option>Annual Report</option>
                  </select>
                </div>
              </div>

              {/* Receipt Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-text-primary">Select Receipts to Include</p>
                  <button
                    onClick={() => setSelectedReceipts(receipts.map(getReceiptId))}
                    className="text-xs text-primary font-semibold cursor-pointer hover:text-primary-dark"
                  >
                    Select All
                  </button>
                </div>
                <div className="space-y-2">
                  {receipts.length > 0 ? receipts.map((receipt) => {
                    const rid = getReceiptId(receipt)
                    const extracted = receipt.extractedData || {}
                    return (
                      <label
                        key={rid}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          selectedReceipts.includes(rid)
                            ? 'border-primary bg-primary/5'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedReceipts.includes(rid)}
                          onChange={() => toggleReceipt(rid)}
                          className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-text-primary">{extracted.vendor || extracted.vendor_name || receipt.vendor || 'Unknown Vendor'}</p>
                          <p className="text-xs text-text-muted">{extracted.date || receipt.date} • {extracted.category || receipt.category || 'Uncategorized'}</p>
                        </div>
                        <p className="text-sm font-bold text-primary">₹{(extracted.amount || receipt.amount || 0).toLocaleString()}</p>
                      </label>
                    )
                  }) : (
                    <div className="text-center py-8 text-text-muted">
                      <p>No processed receipts available. Upload and process receipts first.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary & Generate Button */}
              <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Selected: {selectedReceipts.length} receipts</p>
                  <p className="text-xl font-bold text-primary">Total: ₹{totalAmount.toLocaleString()}</p>
                </div>
                <Button
                  icon={Sparkles}
                  size="lg"
                  onClick={handleGenerate}
                  loading={generating}
                  disabled={selectedReceipts.length === 0}
                >
                  {generating ? 'AI Generating...' : 'Generate Form 10BD'}
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* Generated Form Preview */}
          {generated && generatedForm && (
            <Card className="border-success/30 bg-success/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <h3 className="text-lg font-bold text-text-primary">Form 10BD Generated!</h3>
                  </div>
                  <Badge variant="success">AI Generated</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">

                  {/* Form header */}
                  <div className="text-center border-b border-slate-100 pb-4">
                    <p className="text-xs text-text-muted uppercase tracking-wider">Government of India</p>
                    <h4 className="text-lg font-bold text-text-primary">FORM NO. 10BD</h4>
                    <p className="text-sm text-text-secondary">Statement of donations received</p>
                  </div>

                  {/* Form fields from API response */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Name of Donee', value: generatedForm.doneeName || generatedForm.organizationName || '-' },
                      { label: 'PAN of Donee', value: generatedForm.pan || '-' },
                      { label: 'Financial Year', value: generatedForm.financialYear || '2024-25' },
                      { label: 'Total Donations', value: `₹${(generatedForm.totalDonations || totalAmount).toLocaleString()}` },
                      { label: 'Number of Donors', value: `${generatedForm.donorCount || selectedReceipts.length}` },
                      { label: 'Section', value: generatedForm.section || '80G' },
                    ].map((field) => (
                      <div key={field.label} className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-text-muted">{field.label}</p>
                        <p className="text-sm font-semibold text-text-primary">{field.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-accent/5 border border-accent/10 rounded-lg p-3 text-xs text-accent">
                    🤖 AI Generated — All fields auto-populated from processed receipts. Please review before submission.
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    icon={Eye}
                    className="flex-1"
                    onClick={() => {
                      const url = generatedForm?.downloadUrl
                      if (url) window.open(url, '_blank')
                      else toast.error('Preview URL not available')
                    }}
                  >
                    Preview PDF
                  </Button>
                  <Button
                    variant="secondary"
                    icon={Edit3}
                    className="flex-1"
                    onClick={() => setShowEditModal(true)}
                  >
                    Edit Fields
                  </Button>
                  <Button
                    icon={Download}
                    className="flex-1"
                    onClick={() => {
                      const url = generatedForm?.downloadUrl
                      if (url) window.open(url, '_blank')
                      else toast.error('Download URL not available')
                    }}
                  >
                    Download PDF
                  </Button>
                </div>

              {/* Edit Fields Modal */}
              {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
                    <h3 className="text-lg font-bold text-text-primary">Edit Form Fields</h3>
                    <p className="text-sm text-text-muted">Update the auto-populated fields before downloading.</p>
                    <div className="space-y-3">
                      {[
                        { label: 'Name of Donee', key: 'doneeName' },
                        { label: 'PAN of Donee', key: 'pan' },
                        { label: 'Financial Year', key: 'financialYear' },
                      ].map(({ label, key }) => (
                        <div key={key} className="space-y-1">
                          <label className="text-xs font-medium text-text-primary">{label}</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                            value={generatedForm?.[key] || ''}
                            onChange={(e) => setGeneratedForm((prev) => ({ ...prev, [key]: e.target.value }))}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button variant="secondary" className="flex-1" onClick={() => setShowEditModal(false)}>Cancel</Button>
                      <Button className="flex-1" onClick={() => { setShowEditModal(false); toast.success('Fields updated!') }}>Save Changes</Button>
                    </div>
                  </div>
                </div>
              )}
              </CardContent>
            </Card>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Previous Forms */}
          <Card>
            <CardHeader>
              <h3 className="font-bold text-text-primary">Previous Forms</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {previousForms.length > 0 ? previousForms.map((form, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{form.type || form.formType || 'Form 10BD'}</p>
                    <p className="text-xs text-text-muted">{form.year || form.financialYear} • {form.date || form.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={form.status === 'Approved' || form.status === 'approved' ? 'success' : 'warning'}>
                      {form.status}
                    </Badge>
                    <button
                      type="button"
                      className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                      onClick={() => {
                        const url = form.downloadUrl || form.download_url
                        if (url) window.open(url, '_blank')
                        else toast.error('Download URL not available')
                      }}
                      title="Open in new tab"
                    >
                      <Download className="w-4 h-4 text-text-muted" />
                    </button>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-text-muted text-center py-4">No previous forms generated yet.</p>
              )}
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/10">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                🤖 How AI Generation Works
              </h3>
              {[
                { step: '1', text: 'Select processed receipts for the financial year' },
                { step: '2', text: 'AI aggregates data and maps to Form 10BD fields' },
                { step: '3', text: 'Review generated form and edit if needed' },
                { step: '4', text: 'Download PDF and submit to authorities' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {s.step}
                  </span>
                  <p className="text-sm text-text-secondary">{s.text}</p>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-200">
                <p className="text-xs text-text-muted">
                  ⚡ Average time: <strong>10 minutes</strong> vs 8 hours manually
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

    </DashboardLayout>
  )
}