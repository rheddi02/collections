import AdminSidebar from "./_components/admin-sidebar";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="h-full min-w-0 flex-1 overflow-auto p-2">
        <div className="h-full overflow-hidden rounded-md border bg-card">
          {children}
        </div>
      </div>
    </div>
  );
}
