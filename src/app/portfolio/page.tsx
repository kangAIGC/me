import { Navbar } from '@/components/Navbar';
import { PortfolioPage } from '@/components/PortfolioPage';

export default function PortfolioRoute() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <PortfolioPage />
    </div>
  );
}
