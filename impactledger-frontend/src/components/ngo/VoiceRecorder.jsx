import { Mic, MicOff, RotateCcw, Send, Volume2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'

export default function VoiceRecorder({
  isRecording,
  formattedDuration,
  onStart,
  onStop,
  onReset,
  onSubmit,
  audioBlob,
}) {
  const handlePlay = () => {
    if (!audioBlob) return
    const url = URL.createObjectURL(audioBlob)
    const audio = new Audio(url)
    audio.play().catch(() => {
      toast.error('Playback not supported for this format in your browser. Try Chrome or Edge.')
    })
    audio.onended = () => URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">

      {/* Mic Button with Pulse Animation */}
      <div className="relative">
        {isRecording && (
          <>
            <div className="absolute inset-0 bg-error/20 rounded-full animate-ping" />
            <div className="absolute -inset-4 bg-error/10 rounded-full animate-pulse" />
            <div className="absolute -inset-8 bg-error/5 rounded-full animate-pulse" />
          </>
        )}

        <button
          onClick={isRecording ? onStop : onStart}
          className={cn(
            'relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-2xl',
            isRecording
              ? 'bg-error text-white shadow-error/40 scale-110'
              : 'bg-gradient-to-br from-primary to-primary-light text-white shadow-primary/30 hover:scale-105 hover:shadow-primary/50'
          )}
        >
          {isRecording ? (
            <MicOff className="w-10 h-10" />
          ) : (
            <Mic className="w-10 h-10" />
          )}
        </button>
      </div>

      <div className="text-center">
        {isRecording ? (
          <>
            <p className="text-2xl font-bold text-error font-mono">{formattedDuration}</p>
            <p className="text-sm text-text-secondary mt-1 flex items-center gap-2 justify-center">
              <span className="w-2 h-2 bg-error rounded-full animate-pulse" />
              Recording... Tap to stop
            </p>
          </>
        ) : audioBlob ? (
          <>
            <p className="text-lg font-semibold text-success">✓ Recording saved</p>
            <p className="text-sm text-text-muted mt-1">Duration: {formattedDuration}</p>
            <p className="text-xs text-text-muted mt-0.5">Playback works best in Chrome or Edge</p>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold text-text-primary">Tap the mic to start</p>
            <p className="text-sm text-text-muted mt-1">Speak in your preferred language</p>
          </>
        )}
      </div>

      {audioBlob && !isRecording && (
        <div className="flex gap-3">
          <Button variant="ghost" icon={RotateCcw} onClick={onReset}>
            Re-record
          </Button>
          <Button
            variant="secondary"
            icon={Volume2}
            onClick={handlePlay}
          >
            Play
          </Button>
          <Button icon={Send} onClick={onSubmit}>
            Process with AI
          </Button>
        </div>
      )}

    </div>
  )
}