'use client'

import { cn } from '@/utils/utils'
import { ReactNode } from 'react'

type IVariant = 'default' | 'secondary' | 'ghost'

interface Props {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: IVariant
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

function getButtonStyles(variant?: IVariant) {
  switch (variant) {
    case 'secondary':
      return 'h-10 px-2 bg-accent text-foreground hover:opacity-80 rounded-sm'
    case 'ghost':
      return 'text-foreground'
    case 'default':
    default:
      return 'h-10 px-2 bg-foreground text-background hover:opacity-80 rounded-sm'
  }
}

export function Button({
  children,
  disabled,
  variant = 'default',
  className,
  type = 'button',
  onClick,
}: Props) {
  return (
    <button
      className={cn(
        className,
        'py-2 cursor-pointer flex items-center',
        getButtonStyles(variant),
        disabled ? 'opacity-50! cursor-not-allowed!' : '',
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}
