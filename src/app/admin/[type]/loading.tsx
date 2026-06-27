export default function Loading() {
  return (
    <div className="custom-scrollbar h-full overflow-auto">
      <div className="p-5">
        <div className="mb-6 flex items-center justify-between">
          <div className="hidden h-6 w-40 animate-pulse rounded bg-muted sm:block" />
          <div className="hidden gap-2 sm:flex">
            <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="flex w-full items-center justify-between sm:hidden">
            <div className="h-5 w-28 animate-pulse rounded bg-muted" />
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
        <div className="mb-5 h-9 w-full animate-pulse rounded-md bg-muted sm:hidden" />
        <div className="rounded-md border bg-card">
          <div className="hidden border-b bg-card/50 p-3 sm:block">
            <div className="flex gap-3">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                  <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


