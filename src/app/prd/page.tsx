import { Navbar } from '@/components/Navbar';
import { PrdPage } from '@/components/PrdPage';

export default function PrdRoute() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <PrdPage />
    </div>
  );
}
