import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Mail, Lock, Building2, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Tabs from '@/components/ui/Tabs'
import { authAPI } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      // API ref: login only needs email + password. userType comes back in the response.
      const res = await authAPI.login({ email, password })
      const userData = res.data || res
      login(userData, userData.token)
      toast.success('Login successful!')

      // Navigate based on userType from backend response
      if (userData.userType === 'ngo' || userData.userType === 'NGO') {
        navigate('/ngo/dashboard')
      } else {
        navigate('/csr/dashboard')
      }
    } catch (err) {
      toast.error(err?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  // Reusable login form for both tabs
  const LoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-5">
      <Input
        name="email"
        label="Email"
        placeholder="you@example.com"
        icon={Mail}
        required
      />
      <Input
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        icon={Lock}
        required
      />

      {/* Remember me + Forgot password */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-primary focus:ring-primary"
          />
          <span className="text-text-secondary">Remember me</span>
        </label>
        <a href="#" className="text-primary hover:text-primary-dark font-medium">
          Forgot password?
        </a>
      </div>

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        Login
      </Button>
    </form>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 flex items-center justify-center p-4">

      {/* Background blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-text-primary">
              Impact<span className="text-primary">Ledger</span>
            </span>
          </Link>
          <p className="text-text-secondary">Welcome back! Sign in to continue.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/50 p-8">
          <Tabs
            tabs={[
              {
                label: (
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> NGO
                  </span>
                ),
                content: <LoginForm />,
              },
              {
                label: (
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> CSR Investor
                  </span>
                ),
                content: <LoginForm />,
              },
            ]}
          />

          {/* Register link */}
          <p className="text-center text-sm text-text-muted mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:text-primary-dark">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}