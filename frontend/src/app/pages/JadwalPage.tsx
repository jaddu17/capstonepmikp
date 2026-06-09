import { JadwalDonor } from "../components/JadwalDonor";
import { MainLayout } from "../components/MainLayout";

export default function JadwalPage() {
  return (
    <MainLayout>
      <div className="py-12">
        <JadwalDonor />
      </div>
    </MainLayout>
  );
}
