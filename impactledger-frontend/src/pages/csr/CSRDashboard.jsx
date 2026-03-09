import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Search, Briefcase, Heart, Bell, Settings,
  TrendingUp, Users, IndianRupee, Target, ArrowUpRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatCard from '@/components/ui/StatCard'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { CauseAreaChart, GeographicChart, ImpactTimelineChart } from '@/components/csr/PortfolioCharts'
import { useAuth } from '@/hooks/useAuth'
import { investorAPI } from '@/services/api'
import toast from 'react-hot-toast'

const sidebarItems = [
  { label: 'Dashboard', path: '/csr/dashboard', icon: LayoutDashboard },
  { label: 'Discover NGOs', path: '/csr/search', icon: Search },
  { label: 'My Portfolio', path: '/csr/portfolio', icon: Briefcase },
  { label: 'Interests', path: '/csr/interests', icon: Heart, badge: '3' },
  { label: 'Notifications', path: '/csr/notifications', icon: Bell, badge: '7' },
  { label: 'Settings', path: '/csr/settings', icon: Settings },
]

export default function CSRDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await investorAPI.getDashboard()
        const data = res?.data || res
        setDashboardData(data)
      } catch (err) {
        toast.error(err?.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} userType="csr">
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
      </DashboardLayout>
    )
  }

  // 1. Extract what you have from the backend safely
  const totalInvested = dashboardData?.totalInvested || 0
  const ngosSupported = dashboardData?.ngosSupported || 0
  const projectsFunded = dashboardData?.projectsFunded || 0
  const beneficiariesReached = dashboardData?.beneficiariesReached || 0
  const portfolio = dashboardData?.portfolio || []
  const recentActivity = dashboardData?.recentActivity || []
  const causeAreaBreakdown = dashboardData?.causeAreaBreakdown || {}

  // 2. CREATE THE MISSING VARIABLES YOUR UI EXPECTS!
  const stats = {
    totalFunding: `₹${totalInvested.toLocaleString()}`,
    beneficiaries: beneficiariesReached.toLocaleString(),
    activeProjectsCount: projectsFunded,
    averageSroi: '-' // Add this later if backend supports it
  }

  // Map portfolio to activeProjects so the table renders
  const activeProjects = portfolio

  // Provide safe fallbacks for UI sections you haven't wired up to the backend yet
  const causeAreaData = []
  const geoData = []
  const timelineData = []
  const recommendations = []
  const compliance = []


  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="csr">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">CSR Dashboard 📊</h1>
          <p className="text-text-secondary mt-1">Track your social impact portfolio and discover new opportunities</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" icon={Search} onClick={() => navigate('/csr/search')}>
            Discover NGOs
          </Button>
          <Button size="sm" icon={TrendingUp}>Export Report</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Funding Committed"
          value={stats.totalFunding || '₹0'}
          change={stats.fundingChange || ''}
          changeType="positive"
          icon={IndianRupee}
          color="primary"
        />
        <StatCard
          title="Beneficiaries Reached"
          value={stats.beneficiaries || '0'}
          change={stats.beneficiariesChange || ''}
          changeType="positive"
          icon={Users}
          color="success"
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjectsCount?.toString() || '0'}
          change={stats.projectsChange || ''}
          changeType="positive"
          icon={Target}
          color="accent"
        />
        <StatCard
          title="Average SROI"
          value={stats.averageSroi || '-'}
          change={stats.sroiChange || ''}
          changeType="positive"
          icon={TrendingUp}
          color="warning"
        />
      </div>

      {/* Charts Row */}
      {(causeAreaData.length > 0 || geoData.length > 0) && (
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {causeAreaData.length > 0 && <CauseAreaChart data={causeAreaData} />}
          {geoData.length > 0 && <GeographicChart data={geoData} />}
        </div>
      )}

      {/* Impact Timeline */}
      {timelineData.length > 0 && (
        <div className="mb-8">
          <ImpactTimelineChart data={timelineData} />
        </div>
      )}

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Active Projects Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">Active Projects</h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeProjects.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">NGO / Project</th>
                        <th className="text-left py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Cause</th>
                        <th className="text-right py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Funded</th>
                        <th className="text-right py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">SROI</th>
                        <th className="text-right py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeProjects.map((row, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{row.icon || '📋'}</span>
                              <div>
                                <p className="text-sm font-semibold text-text-primary">{row.ngo || row.ngoName || row.organization_name}</p>
                                <p className="text-xs text-text-muted">{row.project || row.projectName}</p>
                              </div>
                            </div>
                          </td>
                          <td><Badge variant="primary">{row.cause || row.causeArea}</Badge></td>
                          <td className="text-right text-sm font-semibold text-text-primary">{row.funded || `₹${(row.fundingAmount || 0).toLocaleString()}`}</td>
                          <td className="text-right text-sm font-bold text-success">{row.sroi || '-'}</td>
                          <td className="text-right">
                            <Badge variant={
                              row.status === 'On Track' || row.status === 'active' ? 'success' :
                                row.status === 'Completed' || row.status === 'completed' ? 'primary' : 'warning'
                            }>
                              {row.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-text-muted">
                  <p>No active projects yet. Discover NGOs to start investing!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">

          {/* AI Recommendations */}
          <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/10">
            <CardHeader>
              <h3 className="font-bold text-text-primary">🤖 AI Recommendations</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.length > 0 ? recommendations.map((rec, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-lg">
                    {rec.icon || (rec.cause === 'Water' ? '💧' : rec.cause === 'Education' ? '📚' : '🌱')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary">{rec.name || rec.organization_name}</p>
                    <p className="text-xs text-text-muted">{rec.cause || rec.causeArea} • {rec.location}</p>
                  </div>
                  <span className="text-sm font-bold text-accent">{rec.match || `${Math.round((rec.relevance_score || 0) * 100)}%`}</span>
                </div>
              )) : (
                <p className="text-sm text-text-muted text-center py-4">No recommendations yet.</p>
              )}
              <Button variant="ghost" size="sm" className="w-full" icon={ArrowUpRight} onClick={() => navigate('/csr/search')}>
                View All Recommendations
              </Button>
            </CardContent>
          </Card>

          {/* Compliance */}
          <Card>
            <CardHeader>
              <h3 className="font-bold text-text-primary">📋 Compliance Status</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {compliance.length > 0 ? compliance.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{item.label || item.formType}</p>
                    <p className="text-xs text-text-muted">{item.date || item.dueDate}</p>
                  </div>
                  <Badge variant={item.urgency || (item.status === 'submitted' ? 'success' : 'warning')}>
                    {item.status}
                  </Badge>
                </div>
              )) : (
                <p className="text-sm text-text-muted text-center py-4">No compliance items.</p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

    </DashboardLayout>
  )
}