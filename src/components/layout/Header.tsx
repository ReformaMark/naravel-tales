import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 items-center fixed w-full bg-white z-50 flex">
      <Link className="flex items-center justify-center" href="#">
        <Image src="/logo.svg" alt="Reading App Logo" className="h-8 w-auto" height="32" width="32" />
        <span className="sr-only">Reading App</span>
      </Link>
      <nav className="ml-auto gap-4 sm:gap-6 hidden md:flex">
        <Link className="text-sm font-bold hover:underline underline-offset-4" href="#">
          Features
        </Link>
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
      </nav>
    </header>
  );
}