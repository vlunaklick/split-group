'use client'

import { useEffect, useRef, useState } from 'react'

export const EasterEgg = () => {
  const [, setKeySequence] = useState<string[]>([])
  const [showVideo, setShowVideo] = useState(false)
  const videoContainerRef = useRef<HTMLDivElement>(null)

  const videoURL = 'https://www.youtube.com/embed/ZMnb9TTsx98?si=jbcxqC5p4u5J0SbV' // Video de Subway Surfers

  const secretSequence = ['s', 'u', 'b', 'w', 'a', 'y'] // Secuencia de teclas

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowVideo(false)
      } else {
        setKeySequence((prevSequence) => {
          const newSequence = [...prevSequence, event.key].slice(-secretSequence.length)
          if (newSequence.join('') === secretSequence.join('')) {
            setShowVideo(true)
          }
          return newSequence
        })
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (videoContainerRef.current && !videoContainerRef.current.contains(event.target as Node)) {
        setShowVideo(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])s

  return (
    <>
      {showVideo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div ref={videoContainerRef} className="relative w-full max-w-3xl h-[608px]">
            <iframe
              width="1080"
              height="608"
              src={videoURL}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Subway Surfers"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  )
}
