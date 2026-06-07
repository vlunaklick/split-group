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
  sheetWidth = '550px',
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
          style={{ width: sheetWidth }}
          className={cn('flex flex-col gap-4', sheetClassName)}
        >
          <SheetHeader className={cn(headerExtra && 'flex flex-row items-center justify-between space-y-0')}>
            <div className="space-y-1.5">
              <SheetTitle>{title}</SheetTitle>
              {description && <SheetDescription>{description}</SheetDescription>}
            </div>
            {headerExtra}
          </SheetHeader>
          <div className={cn('overflow-y-auto flex flex-col gap-4 flex-1', contentClassName)}>
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
      <DrawerContent>
        <DrawerHeader className={cn('text-left', headerExtra && 'flex flex-row items-start justify-between')}>
          <div>
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </div>
          {headerExtra}
        </DrawerHeader>
        <div
          className={cn('px-4 overflow-y-auto flex flex-col gap-4', contentClassName)}
          style={{ maxHeight: drawerMaxHeight }}
        >
          {children}
        </div>
        {showMobileCancel && (
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">{mobileCancelLabel}</Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}
