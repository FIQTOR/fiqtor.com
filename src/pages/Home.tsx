import { Hero } from '../components/home/Hero';
import { HomeSections } from '../components/home/HomeSections';
import { usePageStarted } from '../components/Loader';

export default function Home() {
  const started = usePageStarted();
  return (
    <>
      <Hero started={started} />
      <HomeSections />
    </>
  );
}
