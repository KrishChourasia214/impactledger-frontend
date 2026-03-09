import { useState, useEffect } from 'react'
import {
  LayoutDashboard, User, Upload, FileText, Mic, FolderOpen,
  Bell, Save, MapPin, Phone, Mail, Globe, Camera
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import Spinner from '@/components/ui/Spinner'
import { CAUSE_AREAS, INDIAN_STATES } from '@/utils/constants'
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

export default function NGOProfile() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    organizationName: '',
    registrationNumber: '',
    registrationType: '80G',
    yearEstablished: '',
    description: '',
    impactNarrative: '',
    phone: '',
    email: '',
    website: '',
    state: '',
    districts: '',
    address: '',
    causeAreas: [],
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const ngoId = getUserId(user)
        if (ngoId) {
          const res = await ngoAPI.getProfile(ngoId)
          const data = res?.data || res
          // Per API reference: profile response has geographicFocus.states, contactInfo.address, etc.
          setProfileData({
            organizationName: data?.organizationName || '',
            registrationNumber: data?.registrationNumber || '',
            registrationType: Array.isArray(data?.registrationType) ? data.registrationType.join(', ') : data?.registrationType || '80G',
            yearEstablished: data?.yearEstablished || '',
            description: data?.description || '',
            impactNarrative: data?.impactNarrative || '',
            phone: data?.contactInfo?.phone || '',
            email: data?.contactInfo?.email || '',
            website: data?.contactInfo?.website || '',
            state: data?.geographicFocus?.states?.[0] || '',
            districts: Array.isArray(data?.geographicFocus?.districts) ? data.geographicFocus.districts.join(', ') : '',
            address: data?.contactInfo?.address || '',
            causeAreas: data?.causeAreas || [],
          })
        }
      } catch (err) {
        toast.error(err?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user])

  const updateField = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleCause = (value) => {
    setProfileData((prev) => ({
      ...prev,
      causeAreas: prev.causeAreas.includes(value)
        ? prev.causeAreas.filter((c) => c !== value)
        : [...prev.causeAreas, value],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const ngoId = getUserId(user)
      // Per API reference: PUT body uses geographicFocus and contactInfo nested objects
      const payload = {
        organizationName: profileData.organizationName,
        registrationNumber: profileData.registrationNumber,
        registrationType: profileData.registrationType.includes(',')
          ? profileData.registrationType.split(',').map(s => s.trim())
          : [profileData.registrationType],
        causeAreas: profileData.causeAreas,
        description: profileData.description,
        impactNarrative: profileData.impactNarrative,
        geographicFocus: {
          states: profileData.state ? [profileData.state] : [],
          districts: profileData.districts ? profileData.districts.split(',').map(d => d.trim()) : [],
        },
        contactInfo: {
          address: profileData.address || undefined,
          website: profileData.website || undefined,
          phone: profileData.phone || undefined,
          email: profileData.email || undefined,
        },
      }
      await ngoAPI.updateProfile(ngoId, payload)
      toast.success('Profile saved successfully!')
    } catch (err) {
      toast.error(err?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Organization Profile</h1>
          <p className="text-text-secondary mt-1">Keep your profile updated to attract more CSR investors</p>
        </div>
        <Button icon={Save} onClick={handleSave} loading={saving}>Save Changes</Button>
      </div>

      {/* Profile Completeness */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-text-primary">Profile Completeness</h3>
              <p className="text-sm text-text-muted">Complete profiles get 3x more investor views</p>
            </div>
          </div>
          <ProgressBar value={65} color="primary" showPercentage={false} />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Main Form */}
        <div className="lg:col-span-2 space-y-8">

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-text-primary">Basic Information</h3>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Input label="Organization Name" value={profileData.organizationName} onChange={(e) => updateField('organizationName', e.target.value)} required />
                <Input label="Registration Number" value={profileData.registrationNumber} onChange={(e) => updateField('registrationNumber', e.target.value)} icon={FileText} required />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-primary">Registration Type</label>
                  <select
                    value={profileData.registrationType}
                    onChange={(e) => updateField('registrationType', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="80G">80G</option>
                    <option value="12A">12A</option>
                    <option value="FCRA">FCRA</option>
                  </select>
                </div>
                <Input label="Year Established" value={profileData.yearEstablished} onChange={(e) => updateField('yearEstablished', e.target.value)} type="number" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">Description</label>
                <textarea
                  rows={3}
                  value={profileData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Impact Narrative */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">Impact Narrative</h3>
                <Badge variant="accent">🤖 Used for AI Matching</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-text-muted">
                Write a detailed narrative about your work. This is used by our AI for semantic matchmaking with CSR investors.
              </p>
              <textarea
                rows={6}
                value={profileData.impactNarrative}
                onChange={(e) => updateField('impactNarrative', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
              {profileData.impactNarrative.length > 100 && (
                <div className="flex items-center gap-2 text-sm text-success">
                  <span>✓</span>
                  <span>Good narrative! This gives AI enough context for accurate matching.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact & Location */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-text-primary">Contact & Location</h3>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Input label="Primary Phone" value={profileData.phone} onChange={(e) => updateField('phone', e.target.value)} icon={Phone} />
                <Input label="Email" value={profileData.email} onChange={(e) => updateField('email', e.target.value)} icon={Mail} />
              </div>
              <Input label="Website" value={profileData.website} onChange={(e) => updateField('website', e.target.value)} icon={Globe} />
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-primary">State</label>
                  <select
                    value={profileData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <Input label="Districts" value={profileData.districts} onChange={(e) => updateField('districts', e.target.value)} icon={MapPin} />
              </div>
              <Input label="Address" value={profileData.address} onChange={(e) => updateField('address', e.target.value)} />
            </CardContent>
          </Card>

          {/* Cause Areas */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-text-primary">Cause Areas</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-muted mb-4">Select all cause areas your organization works on</p>
              <div className="flex flex-wrap gap-3">
                {CAUSE_AREAS.map((cause) => (
                  <button
                    key={cause.value}
                    onClick={() => toggleCause(cause.value)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all cursor-pointer ${
                      profileData.causeAreas.includes(cause.value)
                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                        : 'border-slate-200 text-text-secondary hover:border-slate-300'
                    }`}
                  >
                    {cause.icon} {cause.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">

          {/* Profile Photo */}
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-4xl">
                💧
              </div>
              <div>
                <p className="font-bold text-text-primary">{profileData.organizationName || 'Your Organization'}</p>
                <p className="text-sm text-text-muted">{profileData.state || 'India'}</p>
              </div>
              <Button variant="secondary" size="sm" icon={Camera} className="w-full">
                Upload Logo
              </Button>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card>
            <CardHeader>
              <h3 className="font-bold text-text-primary">Verification Status</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: '80G Registration', icon: '✅' },
                { label: '12A Registration', icon: '⏳' },
                { label: 'PAN Verification', icon: '✅' },
                { label: 'NGO Darpan', icon: '❌' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-text-primary">{item.label}</span>
                  <span className="text-lg">{item.icon}</span>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>

    </DashboardLayout>
  )
}