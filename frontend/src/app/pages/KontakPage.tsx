import { Kontak } from "../components/Kontak";
import { MainLayout } from "../components/MainLayout";

export default function KontakPage() {
  return (
    <MainLayout>
      <div className="py-12">
        <Kontak />
      </div>
    </MainLayout>
  );
}
