import Header from '@/components/layout/Header';
import "@/lib/globals.css";
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
        <html lang="en">
            <body className={nunito.className}>
                <div className="flex flex-col min-h-screen bg-white">
                    <Header />
                    {children}
                </div>
            </body>
        </html>
    );
}
