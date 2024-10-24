import { Card, CardContent } from "@/components/ui/card";
import type { TestimonialProps } from "@/types";
import Image from "next/image";

const testimonials: TestimonialProps[] = [
  {
    avatarSrc: "/avatar-1.svg",
    quote: "My students love the interactive stories!",
    author: "Sarah M.",
    role: "3rd Grade Teacher"
  },
  {
    avatarSrc: "/avatar-2.svg",
    quote: "The progress tracking is incredibly helpful.",
    author: "John D.",
    role: "Parent"
  },
  {
    avatarSrc: "/avatar-3.svg",
    quote: "I've never had so much fun reading!",
    author: "Emily R.",
    role: "5th Grade Student"
  }
];

export default function Testimonials() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          What Our Users Say
        </h2>
        <div className="grid gap-6 items-center md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-[#CDC1FF] hover-lift">
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Image src={testimonial.avatarSrc} alt="User Avatar" className="rounded-full h-16 w-16" />
                <p className="text-center italic">{testimonial.quote}</p>
                <p className="text-sm">- {testimonial.author}, {testimonial.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}