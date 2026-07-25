import ItrHero from "@/components/sections/itr-filing/ItrHero";
import ItrTypes from "@/components/sections/itr-filing/ItrTypes";
import DocumentsChecklist from "@/components/sections/itr-filing/DocumentsChecklist";
import WhyFileITR from "@/components/sections/itr-filing/WhyFileITR";
import ItrDeadlines from "@/components/sections/itr-filing/ItrDeadlines";
import ItrFAQs from "@/components/sections/itr-filing/ItrFAQs";

export default function ItrFilingPage() {
  return (
    <main>
      <ItrHero />
      <ItrTypes />
      <DocumentsChecklist />
      <WhyFileITR />
      <ItrDeadlines />
      <ItrFAQs />
    </main>
  );
}