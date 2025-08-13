import { cn } from '@/utils/utils'
import { ButtonProps, buttonVariants } from './button'

interface SkeletonProps {
  className?: string
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  )
}

export function ButtonSkeleton(props: ButtonProps) {
  return (
    <Skeleton
      className={buttonVariants({
        variant: props.variant,
        size: props.size,
        className: cn('bg-muted duration-1000', props.className),
      })}
    />
  )
}
