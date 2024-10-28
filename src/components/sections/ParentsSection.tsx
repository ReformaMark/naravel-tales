"use client"

import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { CheckIcon } from "lucide-react";
import Image from "next/image";

export default function ParentsSection() {
  const features = [
    "Track your child's reading habits and progress",
    "Receive personalized book recommendations",
    "Set reading goals and rewards"
  ];

  return (
    <motion.section
      className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center justify-center bg-secondary"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
          <motion.div
            className="flex flex-col justify-center items-center lg:items-start space-y-4"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">For Parents</h2>
            <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400 text-center lg:text-left">
              Stay involved in your child&apos;s reading journey. Monitor progress, encourage growth, and celebrate achievements together.
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
            {/* <div>
              <Button>
                Join as a Parent
              </Button>
            </div> */}
          </motion.div>
        </div>
      </div>
    </motion.section >
  );
}