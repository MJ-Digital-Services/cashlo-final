import AboutHero from "@/components/sections/about/AboutHero";
import AboutStory from "@/components/sections/about/AboutStory";
import AboutValues from "@/components/sections/about/AboutValues";
import AboutJourney from "@/components/sections/about/AboutJourney";
import AboutStats from "@/components/sections/about/AboutStats";
import AboutCTA from "@/components/sections/about/AboutCTA";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutJourney />
      <AboutStats />
      <AboutCTA />
      {/* <Footer /> */}
    </>
  );
}