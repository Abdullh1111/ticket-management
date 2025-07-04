import { AppSidebar } from "@/components/sidebar/dashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { Home, Inbox } from "lucide-react";

export const metadata: Metadata = {
  title: "Ticket management dashboard",
  description: "Ticket management dashboard",
};

// Menu items.
const items = [
  {
    title: "Ticket lists",
    url: "/admin/tickets",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "/admin/chat",
    icon: Inbox,
  },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen overflow-auto">
        <AppSidebar items={items} />
        <div className="flex-1 relative">
          <SidebarTrigger className="block lg:hidden p-2" />
          <main className="p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
