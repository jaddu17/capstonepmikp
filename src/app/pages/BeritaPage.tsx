import { Berita } from "../components/Berita";
import { MainLayout } from "../components/MainLayout";

export default function BeritaPage() {
  return (
    <MainLayout>
      <div className="py-12">
        <Berita />
      </div>
    </MainLayout>
  );
}
