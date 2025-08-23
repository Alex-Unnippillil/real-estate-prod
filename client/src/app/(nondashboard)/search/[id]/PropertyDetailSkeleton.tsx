import { Skeleton } from "@/components/ui/skeleton";
import PropertyOverviewSkeleton from "./PropertyOverviewSkeleton";
import PropertyDetailsSkeleton from "./PropertyDetailsSkeleton";
import PropertyLocationSkeleton from "./PropertyLocationSkeleton";

export default function PropertyDetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-64 w-full" />
      <div className="flex flex-col md:flex-row justify-center gap-10 mx-10 md:w-2/3 md:mx-auto mt-16 mb-8">
        <div className="order-2 md:order-1 space-y-6">
          <PropertyOverviewSkeleton />
          <PropertyDetailsSkeleton />
          <PropertyLocationSkeleton />
        </div>
        <div className="order-1 md:order-2">
          <Skeleton className="h-64 w-80 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
