import { Sidebar } from "@/components/sidebar/Sidebar";
import { Topbar } from "@/components/topbar/Topbar";
import { ClientProvider } from "@/lib/client-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ClientProvider>
      <div className="min-h-screen bg-bg">
        <Sidebar />
        <div className="ml-[232px] flex min-h-screen flex-col">
          <Topbar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ClientProvider>
  );
}
