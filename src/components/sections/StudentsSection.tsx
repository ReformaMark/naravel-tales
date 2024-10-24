"use client"

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import Image from "next/image";

export default function StudentsSection() {
  const features = [
    "Personalized reading recommendations",
    "Interactive reading exercises",
    "Track your reading progress"
  ];

  return (
    <motion.section
      className="w-full py-12 md:py-24 lg:py-32 overflow-hidden flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 items-center">
          <motion.div
            className="flex flex-col justify-center items-center lg:items-start space-y-4"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">For Students</h2>
            <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400 text-center lg:text-left">
              Embark on an exciting reading adventure! Discover new books, challenge yourself, and watch your reading skills soar.
            </p>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                >
                  <CheckIcon className="w-5 h-5 mr-2 text-green-500" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            className="flex justify-center"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Image
              alt="Student Dashboard"
              className="aspect-[4/3] overflow-hidden rounded-xl object-cover object-center"
              height="400"
              src="/happy-kid.svg"
              width="600"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}