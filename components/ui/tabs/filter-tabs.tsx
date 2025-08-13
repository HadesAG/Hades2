'use client'

import { cn } from '@/utils/utils'
import { Button, ButtonSize, ButtonVariant } from '../custom-button'
import { TabVariant } from './tabs.models'

interface FilterTabsProps<T extends string> {
  options: { label: string; value: T }[]
  selected: T
  variant?: TabVariant
  className?: string
  buttonClassName?: string
  size?: ButtonSize
  onSelect?: (value: T) => void
}

export function FilterTabs<T extends string>({
  options,
  selected,
  variant = TabVariant.DEFAULT,
  className,
  buttonClassName,
  size,
  onSelect,
}: FilterTabsProps<T>) {
  const getVariant = (isActive: boolean) => {
    if (isActive) {
      if (variant === TabVariant.DEFAULT) {
        return ButtonVariant.DEFAULT
      } else {
        return ButtonVariant.DEFAULT_SOCIAL
      }
    } else {
      return ButtonVariant.GHOST
    }
  }

  return (
    <div className={cn('flex items-center gap-2 mb-4', className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          className={cn('rounded-full', buttonClassName)}
          variant={getVariant(selected === option.value)}
          onClick={() => onSelect?.(option.value)}
          size={size}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
