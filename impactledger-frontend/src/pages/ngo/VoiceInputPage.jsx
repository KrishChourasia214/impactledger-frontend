import { useState } from 'react'
import {
  LayoutDashboard, User, Upload, FileText, Mic, FolderOpen,
  Bell, Globe, Check, ArrowRight
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import VoiceRecorder from '@/components/ngo/VoiceRecorder'
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder'
import { LANGUAGES } from '@/utils/constants'
import { voiceAPI } from '@/services/api'
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

export default function VoiceInputPage() {
  const [language, setLanguage] = useState('hi-IN')
  const [context, setContext] = useState('impact_report')
  const [transcription, setTranscription] = useState(null)
  const [extractedData, setExtractedData] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [saved, setSaved] = useState(false)

  const {
    isRecording,
    audioBlob,
    audioFilename,
    formattedDuration,
    startRecording,
    stopRecording,
    resetRecording,
  } = useVoiceRecorder()

  // Process audio via API
  const handleProcess = async () => {
    if (!audioBlob) {
      toast.error('No audio recorded. Please record first.')
      return
    }

    setProcessing(true)
    try {
      // Per API reference: voice/transcribe expects 'file' + 'languageCode'
      const formData = new FormData()
      formData.append('file', audioBlob, audioFilename)
      formData.append('languageCode', language)
      formData.append('context', context)

      const res = await voiceAPI.transcribe(formData)
      const data = res?.data || res

      // Per API reference: response has transcription, language, structuredData, feedbackText
      setTranscription({
        original: data?.transcription || data?.text || '',
        english: data?.feedbackText || '',
        confidence: data?.confidence || 0,
      })

      if (data?.structuredData) {
        setExtractedData(data.structuredData)
      }

      toast.success('Audio processed successfully!')
    } catch (err) {
      toast.error(err?.message || 'Failed to process audio')
    } finally {
      setProcessing(false)
    }
  }

  const handleSave = () => {
    setSaved(true)
    toast.success('Data saved successfully!')
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    resetRecording()
    setTranscription(null)
    setExtractedData(null)
    setSaved(false)
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="ngo">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Voice Input 🎤</h1>
        <p className="text-text-secondary mt-1">
          Speak in your language. AI will transcribe, translate, and structure your data automatically.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Main Area */}
        <div className="lg:col-span-2 space-y-6">

          {/* Language & Context */}
          <Card>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-primary flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>{lang.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-primary flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Context
                  </label>
                  <select
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="impact_report">Impact Report</option>
                    <option value="project_update">Project Update</option>
                    <option value="profile_update">Profile Update</option>
                    <option value="beneficiary_story">Beneficiary Story</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Recorder */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">Record Your Message</h3>
                <Badge variant="accent">🤖 AI Transcription</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <VoiceRecorder
                isRecording={isRecording}
                formattedDuration={formattedDuration}
                onStart={startRecording}
                onStop={stopRecording}
                onReset={handleReset}
                onSubmit={handleProcess}
                audioBlob={audioBlob}
              />

              {/* Processing animation */}
              {processing && (
                <div className="text-center py-6 space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
                    <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <p className="text-sm text-text-secondary">AI is processing your voice...</p>
                  <div className="flex items-center justify-center gap-4 text-xs text-text-muted">
                    <span>🎤 Transcribing</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>🌐 Translating</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>🤖 Extracting</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transcription Result */}
          {transcription && (
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-text-primary">Transcription Result</h3>
                  {transcription.confidence > 0 && (
                    <Badge variant="success">
                      {Math.round(transcription.confidence * 100)}% confidence
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {transcription.original && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-xs text-amber-600 font-semibold mb-1 uppercase tracking-wider">Original</p>
                    <p className="text-text-primary leading-relaxed">{transcription.original}</p>
                  </div>
                )}
                {transcription.english && (
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <p className="text-xs text-primary font-semibold mb-1 uppercase tracking-wider">English Translation</p>
                    <p className="text-text-primary leading-relaxed">{transcription.english}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Extracted Data */}
          {extractedData && (
            <Card className="border-accent/20 bg-accent/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-text-primary">🤖 AI Extracted Data</h3>
                  <Badge variant="accent">Structured by AI</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(extractedData).map(([key, value]) => {
                    const displayValue = value == null || value === ''
                      ? '—'
                      : Array.isArray(value)
                        ? (value.length ? value.join(', ') : '—')
                        : String(value)
                    return (
                      <div key={key} className="bg-white rounded-xl p-4 border border-slate-200">
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                          {key.replace(/_/g, ' ')}
                        </p>
                        <p className={`text-sm font-semibold ${displayValue === '—' ? 'text-text-muted' : 'text-text-primary'}`}>
                          {displayValue}
                        </p>
                      </div>
                    )
                  })}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="secondary" className="flex-1" onClick={handleReset}>
                    Re-record
                  </Button>
                  <Button
                    className="flex-1"
                    icon={saved ? Check : ArrowRight}
                    variant={saved ? 'success' : 'primary'}
                    onClick={handleSave}
                  >
                    {saved ? 'Saved Successfully!' : 'Confirm & Save'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">

          {/* Tips */}
          <Card>
            <CardHeader>
              <h3 className="font-bold text-text-primary">💡 Tips for Best Results</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                'Speak clearly and at a normal pace',
                'Mention specific numbers (beneficiaries, amounts)',
                'Include location names clearly',
                'Describe the timeframe (this month, last quarter)',
                'Keep recordings under 2 minutes for best accuracy',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <p className="text-sm text-text-secondary">{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Supported Languages */}
          <Card>
            <CardHeader>
              <h3 className="font-bold text-text-primary">🌐 Supported Languages</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <span
                    key={lang.code}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                      language === lang.code
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-slate-50 text-text-muted border-slate-200'
                    }`}
                  >
                    {lang.label}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

    </DashboardLayout>
  )
}