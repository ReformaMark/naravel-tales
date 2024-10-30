"use client"
import { Button, buttonVariants } from "@/components/ui/button";
import { loginModalURLSyncAtom } from "@/features/auth/loginModal";
import { useSetAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const setIsLoginModalOpen = useSetAtom(loginModalURLSyncAtom)

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex flex-col items-center justify-center relative">
      <div className="container px-4 md:px-20 lg:ml-[150px]">
        <div className="grid gap-6 lg:grid-cols-2 items-center justify-center">
          <div className="flex flex-col justify-center items-center lg:items-start space-y-4">
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Adventure in reading, anytime, anywhere
              </h1>
              <p className="lg:max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
                Engage your students with our gamified reading platform. Make learning fun and effective!
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row relative">
              <Link
                href="/auth"
                className={buttonVariants({ variant: "default" })}
              >
                Get Started
              </Link>
              <Button
                variant="outline"
                onClick={() => setIsLoginModalOpen(true)}
                className="relative z-10"
              >
                Already a user?
              </Button>
              <div className="absolute -bottom-30 -left-[50px] w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 hidden lg:block pointer-events-none">
                <Image
                  alt="Pointing Owl"
                  className="w-full h-full object-contain z-0 pointer-events-none"
                  src="/arrow-owl.svg"
                  width={250}
                  height={250}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              alt="Hero Image"
              className="aspect-[4/3] overflow-hidden rounded-xl object-cover object-center"
              height={400}
              src="/starter.png"
              width={600}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
