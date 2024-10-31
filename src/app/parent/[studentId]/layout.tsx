import { ParentSidebar } from '@/components/parent-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function StudentParentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <SidebarProvider>
                <ParentSidebar />
                <div className="flex flex-col min-h-screen bg-white container mx-auto p-4 md:p-0">
                    {children}
                </div>
            </SidebarProvider>
        </div>
    );
}