import { Skeleton } from "@/components/ui/skeleton";

export default function ListingsSkeleton() {
  return (
    <div className="w-full p-4 space-y-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl shadow-lg">
          <Skeleton className="h-48 w-full rounded-t-xl" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
