import Image from "next/image";

export default function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-[#1E1E2E] text-white flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col xl:flex-row items-center justify-center text-center space-y-4">
          <div className="flex flex-col space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none pr-2 animate-pulse bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Power Up Reading Adventure
            </h2>
            <p className="2xl:max-w-[600px] text-zinc-200 md:text-xl text-center">
              Unlock a world of Filipino stories and knowledge with our interactive reading platform.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Image
              src="/power-up.png"
              alt="Reading App Mascot"
              className="object-contain pointer-events-none"
              height={320}
              width={320}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
