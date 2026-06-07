'use client'

import { useEffect, useState } from 'react'

function getModKeyLabel () {
  if (typeof navigator === 'undefined') return 'Ctrl'

  const platform = navigator.platform ?? navigator.userAgent
  return /Mac|iPhone|iPad|iPod/i.test(platform) ? '⌘' : 'Ctrl'
}

export function useModKeyLabel () {
  const [label, setLabel] = useState('Ctrl')

  useEffect(() => {
    setLabel(getModKeyLabel())
  }, [])

  return label
}
