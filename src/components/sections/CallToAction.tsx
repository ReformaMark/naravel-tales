import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to start your reading journey?
            </h2>
            <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
              Join thousands of teachers, parents, and students who are already using our platform to make reading fun and effective.
            </p>
            <Button>
              Start Now
            </Button>
          </div>
        </div>

      </section>
      <div
        className="wavy-bg w-full h-[300px]"
      />
    </>
  );
}