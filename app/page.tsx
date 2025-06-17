import dynamic from 'next/dynamic';
import Header from '@/components/Header';

const App = dynamic(() => import('@/components/App'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <App />
    </main>
  );
}