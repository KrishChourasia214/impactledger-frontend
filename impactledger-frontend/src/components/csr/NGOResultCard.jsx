import { MapPin, Users, TrendingUp, ExternalLink, Heart } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import SROIBadge from './SROIBadge'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'

export default function NGOResultCard({ ngo, onExpressInterest, onViewDetails }) {
  // API returns camelCase; support both for compatibility
  const name = ngo.organizationName || ngo.organization_name || ngo.name || ''
  const location = ngo.location || (ngo.geographicFocus?.states && ngo.geographicFocus.states[0]) || ''
  const verified = ngo.verified ?? (ngo.verificationStatus === 'VERIFIED')
  const score = ngo.predicted_sroi ?? ngo.predictedSroi
  const scoreConfidence = ngo.sroi_confidence ?? ngo.sroiConfidence
  const relevanceScore = ngo.similarityScore ?? ngo.relevance_score ?? 0
  const description = ngo.impactNarrative || ngo.description || ngo.impact_summary || ''
  const causeAreasList = ngo.causeAreas || ngo.cause_areas || []
  const totalFunding = ngo.totalFundingReceived ?? ngo.funding_required ?? ngo.total_funding_received ?? 0
  const beneficiaries = ngo.totalBeneficiaries ?? ngo.beneficiaries ?? ngo.total_beneficiaries ?? 0
  const projectsCount = ngo.projects_count ?? 0
  const ngoId = ngo.ngoId || ngo.ngo_id || ngo._id || ngo.id

  return (
    <Card hover className="overflow-hidden">
      <CardContent className="p-0">

        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-secondary" />

        <div className="p-6 space-y-4">

          {/* Header: Name + SROI */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl shrink-0">
                {ngo.icon || '🏘️'}
              </div>
              <div>
                <h3 className="font-bold text-text-primary">{name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-text-muted" />
                  <span className="text-sm text-text-muted">{location}</span>
                  {verified && (
                    <Badge variant="success" className="text-[10px]">✓ Verified</Badge>
                  )}
                </div>
              </div>
            </div>
            <SROIBadge score={score} confidence={scoreConfidence} />
          </div>

          {/* Match Score Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-accent rounded-full h-2 transition-all"
                style={{ width: `${Number(relevanceScore) * 100}%` }}
              />
            </div>
            <span className="text-sm font-bold text-primary">
              {Math.round(Number(relevanceScore) * 100)}% match
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
            {description}
          </p>

          {/* AI Match Explanation */}
          {(ngo.match_explanation || ngo.matchExplanation) && (
            <div className="bg-accent/5 border border-accent/10 rounded-xl p-3">
              <p className="text-xs text-accent font-medium">
                🤖 AI Match: {ngo.match_explanation || ngo.matchExplanation}
              </p>
            </div>
          )}

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-lg font-bold text-primary">
                ₹{(Number(totalFunding) / 100000).toFixed(1)}L
              </p>
              <p className="text-xs text-text-muted">Funding Need</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-lg font-bold text-success">
                {Number(beneficiaries).toLocaleString()}
              </p>
              <p className="text-xs text-text-muted">Beneficiaries</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-lg font-bold text-accent">
                {projectsCount}
              </p>
              <p className="text-xs text-text-muted">Projects</p>
            </div>
          </div>

          {/* Cause tags */}
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(causeAreasList) ? causeAreasList : []).map((cause) => (
              <Badge key={cause} variant="primary">{cause}</Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="primary"
              size="sm"
              icon={Heart}
              className="flex-1"
              onClick={() => onExpressInterest?.(ngo)}
            >
              Express Interest
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={ExternalLink}
              className="flex-1"
              onClick={() => onViewDetails?.(ngo)}
            >
              View Details
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}