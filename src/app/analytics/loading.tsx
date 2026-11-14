import { Skeleton } from "@/src/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-32 w-full rounded-lg"
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Week Progress Chart */}
        <Skeleton className="lg:col-span-2 h-[350px] w-full rounded-lg" />

        {/* Task Distribution Chart */}
        <Skeleton className="h-[350px] w-full rounded-lg" />
      </div>

      {/* Team Productivity */}
      <Skeleton className="h-[350px] w-full rounded-lg" />

      {/* Team Progress */}
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </div>
  );
}