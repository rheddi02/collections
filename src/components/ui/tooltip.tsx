"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "~/lib/utils"

interface TooltipProps {
  children: React.ReactNode
  label: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  sideOffset?: number
  className?: string
}

export function Tooltip({
  children,
  label,
  side = "top",
  sideOffset = 4,
  className,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>

        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={sideOffset}
            className={cn(
              "z-50 rounded-md bg-black px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95",
              className
            )}
          >
            {label}
            <TooltipPrimitive.Arrow className="fill-black" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
