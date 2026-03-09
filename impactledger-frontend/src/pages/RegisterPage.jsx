import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Users, Building2, ArrowRight, ArrowLeft, Phone, Mail, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { CAUSE_AREAS, INDIAN_STATES } from '@/utils/constants'
import { authAPI } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState(null) // 'NGO' or 'CSR_INVESTOR'
  const [loading, setLoading] = useState(false)

  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    // NGO fields
    organizationName: '',
    registrationNumber: '',
    registrationType: ['80G'],
    causeAreas: [],
    description: '',
    impactNarrative: '',
    state: '',
    districts: '',
    address: '',
    website: '',
    // CSR fields
    companyName: '',
    cin: '',
    annualCsrBudget: '',
    preferredCauseAreas: [],
    preferredStates: [],
  })

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])

  const totalSteps = 4

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleCauseArea = (value) => {
    const field = userType === 'CSR_INVESTOR' ? 'preferredCauseAreas' : 'causeAreas'
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((c) => c !== value)
        : [...prev[field], value],
    }))
  }

  // Handle OTP Input
  const handleOtpChange = (index, e) => {
    const value = e.target.value
    if (isNaN(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleRegister = async () => {
    setLoading(true)
    try {
      // Build payload matching the API reference exactly
      const payload = {
        email: formData.email,
        password: formData.password,
        userType, // 'NGO' or 'CSR_INVESTOR'
        phone: formData.phone || undefined,
      }

      if (userType === 'NGO') {
        payload.organizationName = formData.organizationName
        payload.registrationNumber = formData.registrationNumber
        payload.registrationType = formData.registrationType
        payload.causeAreas = formData.causeAreas
        payload.description = formData.description
        payload.impactNarrative = formData.impactNarrative
        payload.geographicFocus = {
          states: formData.state ? [formData.state] : [],
          districts: formData.districts ? formData.districts.split(',').map(d => d.trim()) : [],
        }
        payload.contactInfo = {
          address: formData.address || undefined,
          website: formData.website || undefined,
        }
      } else {
        payload.companyName = formData.companyName
        payload.cin = formData.cin
        payload.annualCsrBudget = formData.annualCsrBudget ? Number(formData.annualCsrBudget) : undefined
        payload.preferredCauseAreas = formData.preferredCauseAreas
        payload.preferredStates = formData.preferredStates
      }

      await authAPI.register(payload)
      toast.success('OTP sent! Please verify your email.')
      setStep(4)
    } catch (err) {
      toast.error(err?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    setLoading(true)
    try {
      const otpString = otp.join('')
      if (otpString.length !== 6) {
        toast.error('Please enter the complete 6-digit OTP.')
        return
      }
      const res = await authAPI.verifyOTP({ email: formData.email, otp: otpString })
      const userData = res.data || res
      login(userData, userData.token)
      toast.success('Registration successful!')

      if (userData.userType === 'NGO' || userData.userType === 'ngo') {
        navigate('/ngo/dashboard')
      } else {
        navigate('/csr/dashboard')
      }
    } catch (err) {
      toast.error(err?.message || 'OTP verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 flex items-center justify-center p-4">
      <div className="absolute top-10 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-lg">
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
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  s <= step
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-slate-100 text-text-muted'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div className={`w-8 h-0.5 ${s < step ? 'bg-primary' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/50 p-8">
          {/* STEP 1: Choose Role */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-text-primary">Join ImpactLedger</h2>
                <p className="text-text-secondary mt-1">Choose your role to get started</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { type: 'NGO', icon: Users, title: 'NGO', desc: 'Register your organization to access funding', color: 'border-primary bg-primary/5' },
                  { type: 'CSR_INVESTOR', icon: Building2, title: 'CSR Investor', desc: 'Discover and fund impactful projects', color: 'border-accent bg-accent/5' },
                ].map((role) => {
                  const Icon = role.icon
                  return (
                    <button
                      key={role.type}
                      onClick={() => { setUserType(role.type); setStep(2) }}
                      className={`p-6 rounded-2xl border-2 text-left transition-all hover:shadow-lg cursor-pointer ${
                        userType === role.type ? role.color : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-bold text-text-primary">{role.title}</h3>
                      <p className="text-xs text-text-muted mt-1">{role.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Basic Info */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-text-primary">Basic Information</h2>
                <p className="text-text-secondary mt-1">Tell us about yourself</p>
              </div>
              <Input label="Phone Number" placeholder="+91 98765 43210" icon={Phone} value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
              <Input label="Email Address" placeholder="you@example.com" icon={Mail} value={formData.email} onChange={(e) => updateField('email', e.target.value)} required />
              <Input label="Password" type="password" placeholder="Create a password" value={formData.password} onChange={(e) => updateField('password', e.target.value)} required />
            </div>
          )}

          {/* STEP 3: Organization Details */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-text-primary">
                  {userType === 'NGO' ? 'Organization Details' : 'Company Details'}
                </h2>
              </div>

              {userType === 'NGO' ? (
                <>
                  <Input label="Organization Name" placeholder="Enter name" icon={Building2} value={formData.organizationName} onChange={(e) => updateField('organizationName', e.target.value)} required />
                  <Input label="Registration Number (80G/12A)" placeholder="Enter registration number" icon={FileText} value={formData.registrationNumber} onChange={(e) => updateField('registrationNumber', e.target.value)} required />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-text-primary">State</label>
                    <select value={formData.state} onChange={(e) => updateField('state', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-text-primary">Cause Areas</label>
                    <div className="flex flex-wrap gap-2">
                      {CAUSE_AREAS.map((c) => (
                        <button
                          type="button"
                          key={c.value}
                          onClick={() => toggleCauseArea(c.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                            formData.causeAreas.includes(c.value)
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-slate-200 hover:border-primary hover:bg-primary/5 hover:text-primary'
                          }`}
                        >
                          {c.icon} {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Input label="Company Name" placeholder="Enter company name" icon={Building2} value={formData.companyName} onChange={(e) => updateField('companyName', e.target.value)} required />
                  <Input label="CIN Number" placeholder="Enter CIN" icon={FileText} value={formData.cin} onChange={(e) => updateField('cin', e.target.value)} required />
                  <Input label="Annual CSR Budget (₹)" placeholder="e.g., 5000000" type="number" value={formData.annualCsrBudget} onChange={(e) => updateField('annualCsrBudget', e.target.value)} />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-text-primary">Preferred Cause Areas</label>
                    <div className="flex flex-wrap gap-2">
                      {CAUSE_AREAS.map((c) => (
                        <button
                          type="button"
                          key={c.value}
                          onClick={() => toggleCauseArea(c.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                            formData.preferredCauseAreas.includes(c.value)
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-slate-200 hover:border-primary hover:bg-primary/5 hover:text-primary'
                          }`}
                        >
                          {c.icon} {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 4: OTP Verification */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">Verify Your Phone</h2>
                <p className="text-text-secondary mt-1">We&apos;ve sent a 6-digit code to your phone</p>
              </div>
              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                ))}
              </div>
              <p className="text-sm text-text-muted">
                Didn&apos;t receive? <button className="text-primary font-semibold cursor-pointer">Resend OTP</button>
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
            {step > 1 ? (
              <Button variant="ghost" icon={ArrowLeft} onClick={() => setStep(step - 1)}>Back</Button>
            ) : <div />}

            {step < 3 ? (
              <Button icon={ArrowRight} onClick={() => setStep(step + 1)} disabled={step === 1 && !userType}>Continue</Button>
            ) : step === 3 ? (
              <Button icon={ArrowRight} onClick={handleRegister} loading={loading}>Continue</Button>
            ) : (
              <Button icon={ArrowRight} onClick={handleVerifyOtp} loading={loading}>Verify & Complete</Button>
            )}
          </div>

          <p className="text-center text-sm text-text-muted mt-4">
            Already have an account? <Link to="/login" className="text-primary font-semibold">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}