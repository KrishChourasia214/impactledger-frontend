import { useState, useRef, useCallback } from 'react'

function getRecordingMimeType() {
  if (typeof MediaRecorder === 'undefined') return 'audio/webm'
  if (MediaRecorder.isTypeSupported('audio/webm')) return 'audio/webm'
  if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) return 'audio/webm;codecs=opus'
  return null
}

function mimeTypeToExtension(mimeType) {
  if (!mimeType) return 'webm'
  if (mimeType.includes('webm')) return 'webm'
  if (mimeType.includes('mp4')) return 'mp4'
  if (mimeType.includes('ogg')) return 'ogg'
  return 'webm'
}

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const mimeTypeRef = useRef('audio/webm')

  // Start recording from microphone
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const preferredMime = getRecordingMimeType()
      const options = preferredMime ? { mimeType: preferredMime } : {}
      const mediaRecorder = new MediaRecorder(stream, options)
      mimeTypeRef.current = mediaRecorder.mimeType || preferredMime || 'audio/webm'
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const mime = mimeTypeRef.current || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: mime })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start(1000)
      setIsRecording(true)
      setDuration(0)
      setAudioBlob(null)

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1)
      }, 1000)
    } catch (err) {
      console.error('Microphone access denied:', err)
      alert('Please allow microphone access to use voice input.')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      clearInterval(timerRef.current)
    }
  }, [])

  const resetRecording = useCallback(() => {
    setAudioBlob(null)
    setDuration(0)
  }, [])

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const ext = audioBlob ? mimeTypeToExtension(mimeTypeRef.current) : 'webm'
  const audioFilename = `recording.${ext}`

  return {
    isRecording,
    audioBlob,
    audioFilename,
    duration,
    formattedDuration: formatDuration(duration),
    startRecording,
    stopRecording,
    resetRecording,
  }
}