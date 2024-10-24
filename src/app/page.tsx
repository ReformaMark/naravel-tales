import CallToAction from '@/components/sections/CallToAction';
import Features from '@/components/sections/Features';
import Hero from '@/components/sections/Hero';
import ParentsSection from '@/components/sections/ParentsSection';
import StudentsSection from '@/components/sections/StudentsSection';
import TeachersSection from '@/components/sections/TeachersSection';

export default function Home() {
  return (
    <main className="flex-1 pt-14 text-primary overflow-x-hidden">
      <Hero />
      <Features />
      <div className="parallax-container">
        <TeachersSection />
        <ParentsSection />
        <StudentsSection />
      </div>
      <CallToAction />
    </main>
  );
}