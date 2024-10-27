import { AppSidebar } from '@/components/app-sidebar';
import { ConvexClientProvider } from '@/components/convex-client-provider';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import "@/lib/globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { Nunito } from 'next/font/google';

const nunito = Nunito({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Naravel Tales | Teachers",
    description: "Naravel Tales is a platform for teachers, parents, and students to make reading fun and effective.",
};

export default function TeachersLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ConvexAuthNextjsServerProvider>
            <html lang="en">
                <body className={nunito.className}>
                    <SidebarProvider>
                        <AppSidebar />
                        <ConvexClientProvider>
                            <div className="flex flex-col min-h-screen bg-white container mx-auto">
                                {children}
                            </div>
                        </ConvexClientProvider>
                    </SidebarProvider>
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    );
}