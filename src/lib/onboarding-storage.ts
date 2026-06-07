const USER_DISMISS_KEY = 'split-group-onboarding-dismissed'

export function isUserOnboardingDismissed () {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(USER_DISMISS_KEY) === 'true'
}

export function dismissUserOnboarding () {
  localStorage.setItem(USER_DISMISS_KEY, 'true')
}

export function groupOnboardingDismissKey (groupId: string) {
  return `split-group-onboarding-${groupId}-dismissed`
}

export function isGroupOnboardingDismissed (groupId: string) {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(groupOnboardingDismissKey(groupId)) === 'true'
}

export function dismissGroupOnboarding (groupId: string) {
  localStorage.setItem(groupOnboardingDismissKey(groupId), 'true')
}
