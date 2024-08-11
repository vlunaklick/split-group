"use client"

import { cn } from "@/lib/utils"
import AnimatedGradientText from "@/components/magicui/animated-gradient-text"

export function Announcement() {
  return (
    <div className="z-10 flex min-h-[4rem] items-center justify-center">
      <AnimatedGradientText>
        🎉 <hr className="mx-2 h-4 w-[1px] shrink-0" />{" "}
        <span
          className={cn(
            `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
          )}
        >
          Lanzamiento
        </span>
      </AnimatedGradientText>
    </div>
  )
}