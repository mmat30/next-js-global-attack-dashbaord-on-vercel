import { Skeleton } from "@/components/ui/skeleton"

export function GlobeSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Skeleton className="aspect-square w-3/4 rounded-full" />
    </div>
  )
}
