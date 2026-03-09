import { useState } from 'react'
import { IndianRupee, Send, Building2 } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { investorAPI } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import { getUserId } from '@/utils/cn'
import toast from 'react-hot-toast'

export default function ExpressInterestModal({ isOpen, onClose, ngo }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [amount, setAmount] = useState('')
  const [projectId, setProjectId] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Per API reference: express-interest needs investorId, ngoId, projectId, message, proposedFunding
      await investorAPI.expressInterest({
        investorId: getUserId(user),
        ngoId: ngo?.ngoId || ngo?.ngo_id || ngo?._id || ngo?.id,
        projectId: projectId || undefined,
        message: message || undefined,
        proposedFunding: amount ? Number(amount) : undefined,
      })
      setSubmitted(true)
      toast.success('Interest expressed successfully!')
    } catch (err) {
      toast.error(err?.message || 'Failed to send interest. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSubmitted(false)
    setAmount('')
    setProjectId('')
    setMessage('')
    onClose()
  }

  if (!ngo) return null

  const ngoName = ngo.organizationName || ngo.organization_name || ngo.name

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Express Interest" size="md">

      {submitted ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">✉️</span>
          </div>
          <h3 className="text-xl font-bold text-text-primary">Interest Sent!</h3>
          <p className="text-text-secondary">
            Your interest has been sent to <strong>{ngoName}</strong>.
            They will respond within 48 hours.
          </p>
          <Button onClick={handleClose}>Done</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* NGO Info */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
              {ngo.icon || '🏘️'}
            </div>
            <div>
              <p className="font-bold text-text-primary">{ngoName}</p>
              <p className="text-sm text-text-muted">{ngo.location || ngo.geographicFocus?.states?.[0] || ''}</p>
            </div>
            {(ngo.verified || ngo.verificationStatus === 'VERIFIED') && <Badge variant="success">Verified</Badge>}
          </div>

          {/* Funding Amount */}
          <Input
            label="Proposed Funding Amount (₹)"
            placeholder="e.g., 500000"
            icon={IndianRupee}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          {/* Project Selection */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-primary">Select Project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All Projects</option>
            </select>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-primary">Message to NGO</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the NGO about your interest, expectations, and how you'd like to collaborate..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={handleClose}>Cancel</Button>
            <Button type="submit" className="flex-1" icon={Send} loading={loading}>Send Interest</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}