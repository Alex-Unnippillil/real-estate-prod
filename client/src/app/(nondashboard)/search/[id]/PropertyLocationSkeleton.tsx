import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyLocationSkeleton() {
  return (
    <div className="py-16 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-[300px] w-full rounded-lg" />
    </div>
  );
}
