'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

interface ResponsiveSheetProps {
  trigger: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  sheetWidth?: string
  sheetClassName?: string
  contentClassName?: string
  headerExtra?: React.ReactNode
  showMobileCancel?: boolean
  mobileCancelLabel?: string
  drawerMaxHeight?: string
}

export function ResponsiveSheet ({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  sheetWidth = '28rem',
  sheetClassName,
  contentClassName,
  headerExtra,
  showMobileCancel = true,
  mobileCancelLabel = 'Cancelar',
  drawerMaxHeight = '85dvh'
}: ResponsiveSheetProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          {trigger}
        </SheetTrigger>
        <SheetContent
          style={{ width: sheetWidth, maxWidth: '100vw' }}
          className={cn('flex h-full flex-col gap-0 p-0 sm:max-w-lg', sheetClassName)}
        >
          <SheetHeader
            className={cn(
              'shrink-0 space-y-1 border-b border-border px-6 py-5 pr-14 text-left',
              headerExtra && 'flex flex-row items-start justify-between space-y-0'
            )}
          >
            <div className="space-y-1">
              <SheetTitle className="text-base font-medium leading-snug">{title}</SheetTitle>
              {description && (
                <SheetDescription className="text-sm leading-relaxed">{description}</SheetDescription>
              )}
            </div>
            {headerExtra}
          </SheetHeader>
          <div className={cn('min-h-0 flex-1 overflow-y-auto bg-canvas-soft/40 px-6 py-5', contentClassName)}>
            {children}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent className="max-h-[92dvh]">
        <DrawerHeader
          className={cn(
            'border-b border-border px-4 pb-4 pt-2 text-left',
            headerExtra && 'flex flex-row items-start justify-between'
          )}
        >
          <div>
            <DrawerTitle className="text-base font-medium">{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </div>
          {headerExtra}
        </DrawerHeader>
        <div
          className={cn('overflow-y-auto px-4 py-5', contentClassName)}
          style={{ maxHeight: drawerMaxHeight }}
        >
          {children}
        </div>
        {showMobileCancel && (
          <DrawerFooter className="border-t border-border pt-3">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">{mobileCancelLabel}</Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}
