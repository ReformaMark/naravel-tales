"use client"

import { loginModalURLSyncAtom } from "@/features/auth/loginModal";
import { useSetAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from 'next/navigation';

export default function Header() {
  const setIsLoginModalOpen = useSetAtom(loginModalURLSyncAtom)
  const pathname = usePathname();

  const isAuthPage = pathname === '/auth';

  return (
    <header className="px-4 lg:px-6 h-14 items-center fixed w-full bg-white z-50 flex justify-between">
      <Link className="flex items-center justify-center" href="/">
        <Image 
          src="/logo.svg" 
          alt="Reading App Logo" 
          className="h-8 w-auto pointer-events-none" 
          height="32" 
          width="32" 
        />
        <span className="sr-only">Reading App</span>
      </Link>
      {!isAuthPage && (
        <nav className="gap-4 sm:gap-6 hidden md:flex md:items-center">
          <Link className="text-sm font-bold hover:underline underline-offset-4" href="#">
            For Teachers
          </Link>
          <Link className="text-sm font-bold hover:underline underline-offset-4" href="#">
            For Parents
          </Link>
          <Link className="text-sm font-bold hover:underline underline-offset-4" href="#">
            For Students
          </Link>
          <Link className="text-sm font-bold hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Button
            variant="outline"
            onClick={() => setIsLoginModalOpen(true)}
          >
            Login
          </Button>
        </nav>
      )}
    </header>
  );
}
