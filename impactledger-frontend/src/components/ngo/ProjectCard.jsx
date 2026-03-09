import { MapPin, Users, Calendar } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import Card, { CardContent } from '@/components/ui/Card'

export default function ProjectCard({ project }) {
  // API returns camelCase: projectName, fundingRequired, fundingReceived, causeArea (string), targetBeneficiaries
  const statusVariant = {
    ACTIVE: 'success',
    active: 'success',
    DRAFT: 'default',
    draft: 'default',
    COMPLETED: 'primary',
    completed: 'primary',
    CANCELLED: 'danger',
    cancelled: 'danger',
  }

  const fundingRequired = project.fundingRequired || project.funding_required || 0
  const fundingReceived = project.fundingReceived || project.funding_received || 0
  const fundingPercent = fundingRequired
    ? Math.min(Math.round((fundingReceived / fundingRequired) * 100), 100)
    : 0

  // causeArea is a single string in the API; normalize to array for display
  const causeAreas = project.causeAreas || project.cause_areas
    || (project.causeArea ? [project.causeArea] : [])

  const location = project.geographicScope?.state || project.geographicScope?.district
    || project.location || 'India'

  const beneficiaries = project.targetBeneficiaries || project.actualBeneficiaries
    || project.beneficiaries || 0

  return (
    <Card hover>
      <CardContent className="p-6 space-y-4">

        {/* Header: Name + Status */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{project.icon || '📋'}</span>
              <h3 className="font-bold text-text-primary">
                {project.projectName || project.name}
              </h3>
            </div>
            <p className="text-sm text-text-secondary line-clamp-2">{project.description}</p>
          </div>
          <Badge variant={statusVariant[project.status] || 'default'}>
            {project.status}
          </Badge>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Users className="w-4 h-4" />
            <span>{beneficiaries.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Calendar className="w-4 h-4" />
            <span>{project.duration || 'Ongoing'}</span>
          </div>
        </div>

        {/* Funding Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-text-muted">Funding Progress</span>
            <span className="font-semibold text-primary">
              ₹{fundingReceived.toLocaleString()} / ₹{fundingRequired.toLocaleString()}
            </span>
          </div>
          <ProgressBar
            value={fundingPercent}
            color={fundingPercent >= 75 ? 'success' : 'primary'}
            showPercentage={false}
          />
        </div>

        {/* Cause area tags */}
        <div className="flex flex-wrap gap-2">
          {causeAreas.map((cause) => (
            <span
              key={cause}
              className="text-xs bg-slate-100 text-text-muted px-2.5 py-1 rounded-full font-medium"
            >
              {cause}
            </span>
          ))}
        </div>

      </CardContent>
    </Card>
  )
}