import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import PageTransition from '@/components/atoms/PageTransition';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '64px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </>
  );
}
