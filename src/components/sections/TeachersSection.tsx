"use client"

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import Image from "next/image";

export default function TeachersSection() {
  const features = [
    "Real-time student performance tracking",
    "Customizable reading assignments",
    "Detailed analytics and progress reports"
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">For Teachers</h2>
            <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400 text-center lg:text-left">
              Empower your teaching with our comprehensive dashboard. Track student progress, assign readings, and customize learning paths.
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
            <div>
              <Button>
                Get Your Class Started
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="flex justify-center"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Image
              alt="Teacher Dashboard"
              className="aspect-[4/3] overflow-hidden rounded-xl object-cover object-center"
              height="400"
              src="/teacher-owl.svg"
              width="600"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}