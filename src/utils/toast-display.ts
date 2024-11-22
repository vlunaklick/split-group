import { toast } from 'sonner'

export const displayToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
  const alert = localStorage.getItem('alert-size')
  if (alert === 'advanced') {
    toast.message(message, {
      description: new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).replace(/^\w/, c => c.toUpperCase())
    })
  } else {
    toast[type](message, {
      duration: 3000
    })
  }
}
