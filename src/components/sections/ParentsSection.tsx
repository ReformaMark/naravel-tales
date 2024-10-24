import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import Image from "next/image";

export default function ParentsSection() {
  const features = [
    "Track your child's reading habits and progress",
    "Receive personalized book recommendations",
    "Set reading goals and rewards"
  ];

  return (
    <section className="parallax-section w-full py-12 md:py-24 lg:py-32 bg-[#F5EFFF]">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 items-center">
          <div className="flex justify-center order-last lg:order-first">
            <Image
              alt="Parent Dashboard"
              className="aspect-[4/3] overflow-hidden rounded-xl object-cover object-center"
              height="400"
              src="/family-oriented.svg"
              width="600"
            />
          </div>
          <div className="flex flex-col justify-center items-center lg:items-start space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">For Parents</h2>
            <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400 text-center lg:text-left">
              Stay involved in your child&apos;s reading journey. Monitor progress, encourage growth, and celebrate achievements together.
            </p>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <CheckIcon className="w-5 h-5 mr-2 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <div>
              <Button>
                Join as a Parent
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}