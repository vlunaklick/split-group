import { cn } from '@/lib/utils'
import Image from 'next/image'

type LandingScreenshotProps = {
  name: string
  alt: string
  title?: string
  priority?: boolean
  className?: string
  caption?: string
}

export function LandingScreenshot ({
  name,
  alt,
  title = 'Split Group',
  priority = false,
  className,
  caption
}: LandingScreenshotProps) {
  return (
    <figure className={cn('grid w-full gap-3', className)}>
      <div className="relative overflow-hidden rounded-xl border border-border bg-card">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,hsl(var(--primary)/0.08),transparent_55%)]"
          aria-hidden="true"
        />

        <div className="relative border-b border-border px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
            </div>
            <span className="text-sm font-medium text-foreground">{title}</span>
          </div>
        </div>

        <div className="relative">
          <Image
            src={`/landing/${name}-light.png`}
            alt={alt}
            width={1024}
            height={720}
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
            className="h-auto w-full dark:hidden"
          />
          <Image
            src={`/landing/${name}-dark.png`}
            alt={alt}
            width={1024}
            height={720}
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
            className="hidden h-auto w-full dark:block"
          />
        </div>
      </div>

      {caption && (
        <figcaption className="text-center text-xs text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  )
}
