export default function Loading() {
  return (
    <div className="custom-scrollbar h-full overflow-auto">
      <div className="p-5">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-6 w-40 rounded bg-muted animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-16 rounded-md bg-muted animate-pulse" />
            <div className="h-8 w-24 rounded-md bg-muted animate-pulse" />
          </div>
        </div>
        <div className="rounded-md border bg-card">
          <div className="hidden border-b bg-card/50 p-3 sm:block">
            <div className="flex gap-3">
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
              <div className="h-4 w-32 rounded bg-muted animate-pulse" />
              <div className="h-4 w-20 rounded bg-muted animate-pulse" />
            </div>
          </div>
          <div className="divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-40 rounded bg-muted animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-muted animate-pulse" />
                  <div className="h-8 w-8 rounded bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


