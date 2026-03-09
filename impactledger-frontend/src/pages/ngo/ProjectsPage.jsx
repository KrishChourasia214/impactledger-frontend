import { useState, useEffect } from 'react'
import {
  LayoutDashboard, User, Upload, FileText, Mic, FolderOpen,
  Bell, Plus, Search, X,
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card, { CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Spinner from '@/components/ui/Spinner'
import ProjectCard from '@/components/ngo/ProjectCard'
import { useAuth } from '@/hooks/useAuth'
import { ngoAPI } from '@/services/api'
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

const CAUSE_AREAS = [
  'Education', 'Healthcare', 'Environment', 'Women Empowerment',
  'Child Welfare', 'Rural Development', 'Skill Development', 'Nutrition',
]

const EMPTY_FORM = {
  projectName: '',
  description: '',
  causeArea: 'Education',
  fundingRequired: '',
  targetBeneficiaries: '',
  geographicScope: { state: '', district: '' },
  sdgMapping: [],
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [creating, setCreating] = useState(false)

  const fetchProjects = async () => {
    try {
      const ngoId = getUserId(user)
      const res = await ngoAPI.getProjects(ngoId)
      const data = res?.data || res?.projects || res
      setProjects(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error(err?.message || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [user])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.projectName.trim()) {
      toast.error('Project name is required')
      return
    }
    setCreating(true)
    try {
      const ngoId = getUserId(user)
      await ngoAPI.createProject({
        ...form,
        ngoId,
        fundingRequired: form.fundingRequired ? Number(form.fundingRequired) : undefined,
        targetBeneficiaries: form.targetBeneficiaries ? Number(form.targetBeneficiaries) : undefined,
      })
      toast.success('Project created successfully!')
      setShowModal(false)
      setForm(EMPTY_FORM)
      fetchProjects()
    } catch (err) {
      toast.error(err?.message || 'Failed to create project')
    } finally {
      setCreating(false)
    }
  }

  const filteredProjects = projects
    .filter((p) => filter === 'all' || (p.status || '').toLowerCase() === filter)
    .filter((p) => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        (p.projectName || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.causeArea || '').toLowerCase().includes(q)
      )
    })

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">My Projects</h1>
          <p className="text-text-secondary mt-1">Manage your social impact projects and track funding</p>
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>New Project</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {['all', 'active', 'completed', 'draft'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-text-muted hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {f} {f !== 'all' && `(${projects.filter((p) => (p.status || '').toLowerCase() === f).length})`}
            </button>
          ))}
        </div>
        <div className="w-64">
          <Input
            placeholder="Search projects..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.projectId || project.id || project._id} project={project} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card className="py-16 text-center">
          <CardContent>
            <FolderOpen className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
            <p className="text-lg font-semibold text-text-primary">No projects found</p>
            <p className="text-text-muted mt-1">
              {projects.length === 0
                ? 'Create your first project to start attracting investors'
                : 'No projects match the selected filter'}
            </p>
            <Button className="mt-4" icon={Plus} onClick={() => setShowModal(true)}>Create Project</Button>
          </CardContent>
        </Card>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-text-primary">Create New Project</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreate} className="p-6 space-y-5">

              {/* Project Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">
                  Project Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary"
                  placeholder="e.g. Digital Literacy for Rural Youth"
                  value={form.projectName}
                  onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">Description</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary resize-none"
                  placeholder="Briefly describe your project and its impact..."
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Cause Area */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">Cause Area</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary bg-white"
                  value={form.causeArea}
                  onChange={(e) => setForm({ ...form, causeArea: e.target.value })}
                >
                  {CAUSE_AREAS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Funding + Beneficiaries */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-primary">Funding Required (₹)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary"
                    placeholder="e.g. 1000000"
                    value={form.fundingRequired}
                    onChange={(e) => setForm({ ...form, fundingRequired: e.target.value })}
                    min="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-primary">Target Beneficiaries</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary"
                    placeholder="e.g. 2000"
                    value={form.targetBeneficiaries}
                    onChange={(e) => setForm({ ...form, targetBeneficiaries: e.target.value })}
                    min="0"
                  />
                </div>
              </div>

              {/* State + District */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-primary">State</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary"
                    placeholder="e.g. Maharashtra"
                    value={form.geographicScope.state}
                    onChange={(e) => setForm({ ...form, geographicScope: { ...form.geographicScope, state: e.target.value } })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-primary">District</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary"
                    placeholder="e.g. Pune"
                    value={form.geographicScope.district}
                    onChange={(e) => setForm({ ...form, geographicScope: { ...form.geographicScope, district: e.target.value } })}
                  />
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  icon={Plus}
                  className="flex-1"
                  loading={creating}
                >
                  {creating ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  )
}