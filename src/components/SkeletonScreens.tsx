import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-background">
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Skeleton className="h-7 w-24" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-32 hidden md:block" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </nav>
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border border-border p-4 flex flex-col items-center gap-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-border p-6 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const ProjectSkeleton = () => (
  <div className="min-h-screen bg-background">
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-5 w-40" />
      </div>
    </nav>
    <div className="flex">
      <div className="hidden md:block w-56 border-r border-border p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
      <div className="flex-1 p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-border p-6 space-y-3">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-10 w-16" />
            </div>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="min-h-screen bg-background">
    <nav className="border-b-2 border-secondary bg-background/95">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Skeleton className="h-7 w-24" />
        <div className="hidden md:flex items-center gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-16" />
          ))}
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
    </nav>
    <div className="container mx-auto max-w-3xl px-6 py-20">
      <Skeleton className="h-10 w-64 mb-6" />
      <Skeleton className="h-5 w-full mb-3" />
      <Skeleton className="h-5 w-5/6 mb-3" />
      <Skeleton className="h-5 w-4/6 mb-8" />
      <Skeleton className="h-40 w-full" />
    </div>
  </div>
);

export const AuthSkeleton = () => (
  <div className="flex min-h-screen items-center justify-center bg-secondary">
    <div className="w-full max-w-md border border-border bg-card p-8">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-12 w-full mt-4" />
        <Skeleton className="h-3 w-56 mt-4" />
      </div>
    </div>
  </div>
);
