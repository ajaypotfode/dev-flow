import { Skeleton } from "@/src/components/ui/skeleton";

export default function MemberLoading() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-60 rounded-xl" />)}
        </div>
    )
}