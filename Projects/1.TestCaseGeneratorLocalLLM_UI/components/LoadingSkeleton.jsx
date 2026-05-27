import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="animate-fade-in p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-border/40 bg-card/40 p-6 shadow-sm sm:p-8">
          <div className="space-y-4">
            <Skeleton className="h-7 w-44 rounded-lg" />
            <div className="space-y-2.5">
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-3/4 rounded-md" />
            </div>
            <div className="py-1">
              <Skeleton className="h-px w-full rounded-full" />
            </div>
            <Skeleton className="h-5 w-36 rounded-lg" />
            <div className="space-y-2.5">
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-5/6 rounded-md" />
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-2/3 rounded-md" />
            </div>
            <div className="py-1">
              <Skeleton className="h-px w-full rounded-full" />
            </div>
            <Skeleton className="h-5 w-40 rounded-lg" />
            <div className="space-y-2.5">
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-4/5 rounded-md" />
              <Skeleton className="h-3.5 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
