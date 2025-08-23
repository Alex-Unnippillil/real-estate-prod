import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailsSkeleton() {
  return (
    <div className="mb-6 space-y-10">
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-2/3" />
          ))}
        </div>
      </div>
    </div>
  );
}
