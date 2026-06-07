const ONBOARDING_KEY = 'split-group-command-palette-onboarding'

export function hasSeenCommandPaletteOnboarding () {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(ONBOARDING_KEY) === 'true'
}

export function markCommandPaletteOnboardingSeen () {
  localStorage.setItem(ONBOARDING_KEY, 'true')
}
