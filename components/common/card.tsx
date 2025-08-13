import clsx from 'clsx'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: Props) {
  return (
    <div className={clsx('bg-muted rounded-sm p-4', className)}>
      {children}
    </div>
  )
}
