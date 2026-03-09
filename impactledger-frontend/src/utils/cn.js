import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Centralized helper to extract the profile ID (ngoId or investorId) from the auth user object.
// Per API reference: login response.data.profileId = the ngoId or investorId used in API calls.
export function getUserId(user) {
  if (!user) return null
  return user.profileId || user.ngoId || user.investorId || user.userId || user.id || user._id || null
}

// Get the auth-level userId (not the profileId)
export function getAuthUserId(user) {
  if (!user) return null
  return user.userId || user.id || user._id || null
}