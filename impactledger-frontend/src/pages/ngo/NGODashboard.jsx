import { useState, useEffect } from 'react'
import {
  LayoutDashboard, User, Upload, FileText, Mic, FolderOpen,
  Bell, TrendingUp, Users, IndianRupee, FileCheck, Plus
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatCard from '@/components/ui/StatCard'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import Spinner from '@/components/ui/Spinner'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ngoAPI, receiptAPI } from '@/services/api'
import { getUserId } from '@/utils/cn'
import toast from 'react-hot-toast'

const sidebarItems = [
  { label: 'Dashboard', path: '/ngo/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', path: '/ngo/profile', icon: User },
  { label: 'Upload Receipts', path: '/ngo/receipts', icon: Upload, badge: '3' },
  { label: 'Compliance', path: '/ngo/compliance', icon: FileText },
  { label: 'Voice Input', path: '/ngo/voice', icon: Mic },
  { label: 'My Projects', path: '/ngo/projects', icon: FolderOpen },
  { label: 'Notifications', path: '/ngo/notifications', icon: Bell, badge: '5' },
]

export default function NGODashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({
    totalFunding: '₹0',
    beneficiaries: '0',
    activeProjects: '0',
    complianceForms: '0',
  })
  const [activities, setActivities] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const ngoId = getUserId(user)
        if (!ngoId) {
          setLoading(false)
          return
        }
        const profileRes = await ngoAPI.getProfile(ngoId)
        const profileData = profileRes?.data || profileRes
        setProfile(profileData)

        // Derive stats from profile — per API reference: totalFundingReceived, totalBeneficiaries
        setStats({
          totalFunding: profileData?.totalFundingReceived ? `₹${Number(profileData.totalFundingReceived).toLocaleString('en-IN')}` : '₹0',
          beneficiaries: profileData?.totalBeneficiaries?.toLocaleString('en-IN') || '0',
          activeProjects: profileData?.activeProjects?.toString() || '0',
          complianceForms: profileData?.complianceForms?.toString() || '0',
        })

        // If the profile contains recent activity
        if (profileData?.recentActivity) {
          setActivities(profileData.recentActivity)
        }
      } catch (err) {
        // Silently ignore profile 500 errors — dashboard still renders with empty stats
        console.error('Dashboard profile fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [user])

  const userName = user?.name || profile?.contactPerson || 'User'

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
          <h1 className="text-3xl font-bold text-text-primary">Welcome back, {userName}! 👋</h1>
          <p className="text-text-secondary mt-1">Here&apos;s what&apos;s happening with your organization today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" icon={Mic} onClick={() => navigate('/ngo/voice')}>
            Voice Input
          </Button>
          <Button size="sm" icon={Plus} onClick={() => navigate('/ngo/projects')}>
            New Project
          </Button>
        </div>
      </div>

      {/* Profile Completeness Banner */}
      <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-text-primary">Complete your profile to attract more investors</h3>
              <p className="text-sm text-text-secondary">A complete profile gets 3x more visibility</p>
            </div>
            <Button size="sm" variant="primary" onClick={() => navigate('/ngo/profile')}>
              Complete Profile
            </Button>
          </div>
          <ProgressBar value={profile?.profileCompleteness || 0} label="Profile Completeness" color="primary" />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Funding Received"
          value={stats.totalFunding}
          icon={IndianRupee}
          color="primary"
        />
        <StatCard
          title="Beneficiaries Reached"
          value={stats.beneficiaries}
          icon={Users}
          color="success"
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={FolderOpen}
          color="accent"
        />
        <StatCard
          title="Compliance Forms"
          value={stats.complianceForms}
          icon={FileCheck}
          color="warning"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-text-primary">Recent Activity</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length > 0 ? activities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                    <span className="text-2xl">{activity.icon || '📋'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary text-sm">{activity.title}</p>
                      <p className="text-sm text-text-muted truncate">{activity.desc || activity.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {activity.status && <Badge variant={activity.statusColor || 'default'}>{activity.status}</Badge>}
                      <p className="text-xs text-text-muted mt-1">{activity.time || activity.date}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-text-muted">
                    <p>No recent activity yet. Start by uploading receipts or creating a project!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-text-primary">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: Upload, label: 'Upload Receipt', desc: 'Scan & process receipts with AI', path: '/ngo/receipts' },
                { icon: FileText, label: 'Generate Form 10BD', desc: 'Auto-generate compliance forms', path: '/ngo/compliance' },
                { icon: Mic, label: 'Voice Report', desc: 'Speak in Hindi or Marathi', path: '/ngo/voice' },
                { icon: FolderOpen, label: 'Update Project', desc: 'Add latest impact data', path: '/ngo/projects' },
              ].map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-primary/30 hover:bg-primary/5 transition-all text-left cursor-pointer group"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary text-sm">{action.label}</p>
                      <p className="text-xs text-text-muted">{action.desc}</p>
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-text-primary">📅 Upcoming Deadlines</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Form 10BD Submission', date: 'Mar 31, 2025', urgency: 'danger' },
                { label: 'Q4 Impact Report', date: 'Apr 15, 2025', urgency: 'warning' },
                { label: 'Annual Report', date: 'Jun 30, 2025', urgency: 'default' },
              ].map((deadline) => (
                <div key={deadline.label} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <span className="text-sm font-medium text-text-primary">{deadline.label}</span>
                  <Badge variant={deadline.urgency}>{deadline.date}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>

    </DashboardLayout>
  )
}