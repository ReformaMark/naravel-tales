import { ConvexClientProvider } from '@/components/convex-client-provider';
import { JotaiProvider } from '@/components/jotai-provider';
import { RoleCheck } from '@/features/auth/components/role-check';
import { EnterStudentCodeModal } from '@/features/parents/components/enter-student-code-modal';
import "@/lib/globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { Nunito } from 'next/font/google';
import { Toaster } from 'sonner';

const nunito = Nunito({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Naravel Tales | Parents",
    description: "Naravel Tales is a platform for teachers, parents, and students to make reading fun and effective.",
};

export default function ParentsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ConvexAuthNextjsServerProvider>
            <html lang="en">
                <body className={nunito.className}>
                    <ConvexClientProvider>
                        <JotaiProvider>
                            <RoleCheck allowedRoles={['parent']} />
                            <EnterStudentCodeModal />
                            <div className="flex flex-col min-h-screen bg-white container mx-auto">
                                {children}
                            </div>
                            <Toaster />
                        </JotaiProvider>
                    </ConvexClientProvider>
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    );
}
