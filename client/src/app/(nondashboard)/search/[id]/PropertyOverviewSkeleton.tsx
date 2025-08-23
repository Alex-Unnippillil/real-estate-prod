import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="border border-border rounded-xl p-6">
        <div className="flex justify-between gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/2" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
