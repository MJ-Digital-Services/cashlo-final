import QuickKhataHero from "@/components/sections/quickkhata/QuickKhataHero";
import QuickKhataFeatures from "@/components/sections/quickkhata/QuickKhataFeatures";
import QuickKhataHowItWorks from "@/components/sections/quickkhata/QuickKhataHowItWorks";
import QuickKhataCTA from "@/components/sections/quickkhata/QuickKhataCTA";
import Footer from "@/components/layout/Footer";

export default function QuickKhataPage() {
  return (
    <main>
      <QuickKhataHero />
      <QuickKhataFeatures />
      <QuickKhataHowItWorks />
      <QuickKhataCTA />
      {/* <Footer /> */}
    </main>
  );
}