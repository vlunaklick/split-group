// @ts-nocheck

import es from 'date-fns/locale/es'
import { format } from 'date-fns' // Import the Locale type

const locale = es

export const formatDate = (date: Date) => {
  return format(date, 'PPP', { locale })
}
