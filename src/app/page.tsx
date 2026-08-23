import { Navbar } from '@/components/Navbar';
import { DemoPage } from '@/components/DemoPage';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <DemoPage />
    </div>
  );
}
