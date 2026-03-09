import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Search, Briefcase, Heart, Bell, Settings,
  ArrowLeft, MapPin, Phone, Mail, Globe, Calendar,
  Users, IndianRupee, ExternalLink, CheckCircle, Shield
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import Spinner from '@/components/ui/Spinner'
import SROIBadge from '@/components/csr/SROIBadge'
import ExpressInterestModal from '@/components/csr/ExpressInterestModal'
import ProjectCard from '@/components/ngo/ProjectCard'
import { ngoAPI } from '@/services/api'
import toast from 'react-hot-toast'

const sidebarItems = [
  { label: 'Dashboard', path: '/csr/dashboard', icon: LayoutDashboard },
  { label: 'Discover NGOs', path: '/csr/search', icon: Search },
  { label: 'My Portfolio', path: '/csr/portfolio', icon: Briefcase },
  { label: 'Interests', path: '/csr/interests', icon: Heart },
  { label: 'Notifications', path: '/csr/notifications', icon: Bell },
  { label: 'Settings', path: '/csr/settings', icon: Settings },
]

export default function NGODetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [interestModalOpen, setInterestModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [ngoData, setNgoData] = useState(null)
  const [projects, setProjects] = useState([])
  const [profileError, setProfileError] = useState(null)

  const isValidUuid = (s) => {
    if (!s || typeof s !== 'string') return false
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(s.trim())
  }

  useEffect(() => {
    if (!id || !isValidUuid(id)) {
      setLoading(false)
      setProfileError('Invalid NGO link.')
      return
    }

    const fetchNGOData = async () => {
      setProfileError(null)
      try {
        const [profileRes, projectsRes] = await Promise.allSettled([
          ngoAPI.getProfile(id),
          ngoAPI.getProjects(id),
        ])

        if (profileRes.status === 'fulfilled') {
          const data = profileRes.value?.data ?? profileRes.value
          if (data && typeof data === 'object') {
            setNgoData(data)
          } else {
            setProfileError('Invalid profile response.')
          }
        } else {
          const errMsg = profileRes.reason?.message || 'Failed to load NGO profile'
          setProfileError(errMsg)
          toast.error(errMsg)
        }

        if (projectsRes.status === 'fulfilled') {
          const data = projectsRes.value?.data ?? projectsRes.value?.projects ?? projectsRes.value
          setProjects(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        const errMsg = err?.message || 'Failed to load NGO details'
        setProfileError(errMsg)
        toast.error(errMsg)
      } finally {
        setLoading(false)
      }
    }
    fetchNGOData()
  }, [id])

  if (loading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} userType="csr">
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
      </DashboardLayout>
    )
  }

  if (!ngoData) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} userType="csr">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-text-primary">NGO Not Found</h2>
          <p className="text-text-muted mt-2 max-w-md mx-auto">
            {profileError || "The NGO you're looking for doesn't exist or has been removed."}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Button onClick={() => navigate('/csr/search')}>Back to Search</Button>
            {profileError && id && isValidUuid(id) && (
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Try again
              </Button>
            )}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const contact = ngoData.contactInfo || ngoData.contact || {}
  const causeAreas = ngoData.causeAreas || ngoData.cause_areas || []
  const registrationTypes = ngoData.registrationType || ngoData.registration_type || []
  const districts = ngoData.geographicFocus?.districts || ngoData.districts || []
  const stateDisplay = ngoData.geographicFocus?.states?.[0] || ngoData.state || ''
  const verified = ngoData.verificationStatus === 'VERIFIED' || ngoData.verified

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="csr">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Search Results</span>
      </button>

      {/* Hero Header */}
      <Card className="mb-8 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-accent to-secondary" />
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left: NGO Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-4xl shrink-0">
                  {ngoData.icon || '🏘️'}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-text-primary">{ngoData.organizationName || ngoData.organization_name || ngoData.name}</h1>
                    {verified && (
                      <Badge variant="success">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {ngoData.location || stateDisplay}</span>
                    {ngoData.year_established || ngoData.yearEstablished ? (
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Est. {ngoData.year_established || ngoData.yearEstablished}</span>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {causeAreas.map((cause) => (
                      <Badge key={cause} variant="primary">{cause}</Badge>
                    ))}
                    {(Array.isArray(registrationTypes) ? registrationTypes : []).map((type) => (
                      <Badge key={type} variant="accent">{type}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-text-secondary leading-relaxed">{ngoData.description}</p>

              {/* Contact */}
              <div className="flex flex-wrap gap-4 mt-4">
                {(contact.phone || ngoData.phone) && (
                  <a href={`tel:${contact.phone || ngoData.phone}`} className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
                    <Phone className="w-4 h-4" /> {contact.phone || ngoData.phone}
                  </a>
                )}
                {(contact.email || ngoData.email) && (
                  <a href={`mailto:${contact.email || ngoData.email}`} className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
                    <Mail className="w-4 h-4" /> {contact.email || ngoData.email}
                  </a>
                )}
                {(contact.website || ngoData.website) && (
                  <a href={contact.website || ngoData.website} target="_blank" className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
                    <Globe className="w-4 h-4" /> Website
                  </a>
                )}
              </div>
            </div>

            {/* Right: Key Metrics & CTA */}
            <div className="lg:w-80 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/5 rounded-xl p-4 text-center">
                  <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xl font-bold text-primary">{(ngoData.total_beneficiaries || ngoData.totalBeneficiaries || 0).toLocaleString()}</p>
                  <p className="text-xs text-text-muted">Beneficiaries</p>
                </div>
                <div className="bg-success/5 rounded-xl p-4 text-center">
                  <IndianRupee className="w-5 h-5 text-success mx-auto mb-1" />
                  <p className="text-xl font-bold text-success">₹{((ngoData.total_funding_received || ngoData.totalFundingReceived || 0) / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-text-muted">Funded</p>
                </div>
              </div>

              {(ngoData.predicted_sroi || ngoData.predictedSroi) && (
                <div className="flex items-center justify-center">
                  <SROIBadge score={ngoData.predicted_sroi || ngoData.predictedSroi} confidence={ngoData.sroi_confidence || ngoData.sroiConfidence} />
                </div>
              )}

              <Button className="w-full" size="lg" icon={Heart} onClick={() => setInterestModalOpen(true)}>
                Express Interest & Fund
              </Button>
              <Button variant="secondary" className="w-full" size="sm" icon={ExternalLink}>
                Download NGO Report
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Impact Narrative */}
          {(ngoData.impact_narrative || ngoData.impactNarrative) && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-text-primary">Impact Narrative</h3>
                  <Badge variant="accent">🤖 Indexed for Semantic Search</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary leading-relaxed">{ngoData.impact_narrative || ngoData.impactNarrative}</p>
              </CardContent>
            </Card>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-text-primary mb-4">Active Projects</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id || project._id} project={project} />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Verification */}
          <Card>
            <CardHeader>
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                <Shield className="w-5 h-5 text-success" /> Verification
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {(ngoData.verifications || [
                { label: '80G Registration', verified },
                { label: 'PAN Verification', verified },
              ]).map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2">
                  <span className="text-sm text-text-secondary">{item.label}</span>
                  <span>{item.verified ? '✅' : '❌'}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Geographic Focus */}
          {(ngoData.state || stateDisplay || districts.length > 0) && (
            <Card>
              <CardHeader>
                <h3 className="font-bold text-text-primary flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Geographic Focus
                </h3>
              </CardHeader>
              <CardContent>
                {(stateDisplay || ngoData.state) && <p className="text-sm font-semibold text-text-primary mb-2">{stateDisplay || ngoData.state}</p>}
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(districts) ? districts : []).map((d) => (
                    <Badge key={d} variant="default">{d}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>

      {/* Express Interest Modal */}
      <ExpressInterestModal
        isOpen={interestModalOpen}
        onClose={() => setInterestModalOpen(false)}
        ngo={ngoData}
      />

    </DashboardLayout>
  )
}