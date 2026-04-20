import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { LevelsSection } from "@/components/LevelsSection";
import { CareerTracks } from "@/components/CareerTracks";
import { SkillsShowcase } from "@/components/SkillsShowcase";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <CareerTracks />
      <LevelsSection />
      <SkillsShowcase />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
