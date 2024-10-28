import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function ClassLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <div className="flex flex-col min-h-screen bg-white container mx-auto">
                    {children}
                </div>
            </SidebarProvider>
        </div>
    );
}