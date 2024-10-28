import { ConvexClientProvider } from '@/components/convex-client-provider';
import { JotaiProvider } from '@/components/jotai-provider';
import Header from '@/components/layout/Header';
import "@/lib/globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { Nunito } from 'next/font/google';

const nunito = Nunito({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Naravel Tales | Auth",
    description: "Naravel Tales is a platform for teachers, parents, and students to make reading fun and effective.",
};

export default function RegisterLayout({
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
                            <div className="flex flex-col min-h-screen bg-white">
                                <Header />
                                {children}
                            </div>
                        </JotaiProvider>
                    </ConvexClientProvider>
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    );
}
