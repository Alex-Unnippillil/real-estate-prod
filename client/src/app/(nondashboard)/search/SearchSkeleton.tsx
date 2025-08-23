import { Skeleton } from "@/components/ui/skeleton";
import ListingsSkeleton from "./ListingsSkeleton";

export default function SearchSkeleton() {
  return (
    <div className="w-full mx-auto px-5 flex flex-col">
      <Skeleton className="h-12 w-full mb-4" />
      <div className="flex justify-between flex-1 overflow-hidden gap-3 mb-5">
        <Skeleton className="h-full w-3/12" />
        <Skeleton className="h-full flex-1" />
        <div className="basis-4/12 overflow-y-auto">
          <ListingsSkeleton />
        </div>
      </div>
    </div>
  );
}
