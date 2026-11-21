import { useState, useCallback } from 'react'
import { saveProfile, loadProfile } from '../services/storageService.js'

const DEFAULT_PROFILE = {
  name: '',
  age: '',
  gender: '',
  weight: '',
  height: '',
  fitnessLevel: 'beginner',
  conditions: [],
  goal: '',
  onboardingComplete: false
}

export function useProfile() {
  const [profile, setProfile] = useState(() => loadProfile() || DEFAULT_PROFILE)

  const updateProfile = useCallback((updates) => {
    setProfile(prev => {
      const next = { ...prev, ...updates }
      saveProfile(next)
      return next
    })
  }, [])

  const completeOnboarding = useCallback((data) => {
    const next = { ...profile, ...data, onboardingComplete: true }
    saveProfile(next)
    setProfile(next)
  }, [profile])

  return { profile, updateProfile, completeOnboarding }
}
