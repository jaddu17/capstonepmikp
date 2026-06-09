import { StokDarah } from "../components/StokDarah";
import { ProsedurDarah } from "../components/ProsedurDarah";
import { MainLayout } from "../components/MainLayout";

export default function StokDarahPage() {
  return (
    <MainLayout>
      <div className="py-12 bg-gray-50">
        <StokDarah />
      </div>
      <ProsedurDarah />
    </MainLayout>
  );
}
