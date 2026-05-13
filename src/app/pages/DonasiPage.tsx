import { Donasi } from "../components/Donasi";
import { MainLayout } from "../components/MainLayout";

export default function DonasiPage() {
  return (
    <MainLayout>
      <div className="py-12">
        <Donasi />
      </div>
    </MainLayout>
  );
}
