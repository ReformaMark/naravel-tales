import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import Image from "next/image";

export default function TeachersSection() {
  const features = [
    "Real-time student performance tracking",
    "Customizable reading assignments",
    "Detailed analytics and progress reports"
  ];

  return (
    <section className="parallax-section w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 items-center">
          <div className="flex flex-col justify-center items-center lg:items-start space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">For Teachers</h2>
            <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400 text-center lg:text-left">
              Empower your teaching with our comprehensive dashboard. Track student progress, assign readings, and customize learning paths.
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
                Get Your Class Started
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              alt="Teacher Dashboard"
              className="aspect-[4/3] overflow-hidden rounded-xl object-cover object-center"
              height="400"
              src="/teacher-owl.svg"
              width="600"
            />
          </div>
        </div>
      </div>
    </section>
  );
}