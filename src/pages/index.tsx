
import Home from '@/modules/home';
import HelmetContainer from '@/components/HelmetContainer';

export default function HomePage() {
  return (
    <>
      <HelmetContainer page="home" />
      <Home />
    </>
  );
}
