import { Hero } from "../components/Hero";
import { TentangPMI } from "../components/TentangPMI";
import { Infografis } from "../components/Infografis";
import { MainLayout } from "../components/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <TentangPMI />
      <Infografis />
    </MainLayout>
  );
}
