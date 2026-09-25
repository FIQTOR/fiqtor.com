import { Suspense, lazy, useContext } from "react";
import Skills from "./sections/Skills";
import About from "./sections/About";
import Header from "./sections/Header";
import SubHeader from "./sections/SubHeader";
import Loading from "@/components/Loading";
import ServicesSection from "./sections/Services";
import RecentProjects from "./sections/RecentProjects";
import { ContainerContext } from "@/context/container-context";
import LineWaves from "@/components/LineWavesLazy";

// Heavy, below-the-fold sections: loaded on their own chunks, keeping the home
// entry chunk small and deferring their work until the browser needs them.
const Certification = lazy(() => import("./sections/Certification"));
const ContributionsGithub = lazy(
    () => import("@/components/github/ContributionsGithub")
);

const Home = () => {
    const { isMobile } = useContext(ContainerContext);

    return (
        <>
            <div className="absolute md:block md:absolute overflow-hidden inset-0 z-0 w-full h-full">
                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent to-white dark:to-black" />
                {!isMobile && (
                    <Suspense fallback={null}>
                        <LineWaves
                            speed={0.3}
                            innerLineCount={12}
                            outerLineCount={15}
                            warpIntensity={1}
                            rotation={-45}
                            edgeFadeWidth={0}
                            colorCycleSpeed={5}
                            brightness={0.05}
                            color1="#ffffff"
                            color2="#ffffff"
                            color3="#ffffff"
                            enableMouseInteraction
                            mouseInfluence={2}
                        />
                    </Suspense>
                )}
            </div>
            <Header />
            <main className="flex flex-col gap-12 py-14 md:gap-24">
                <SubHeader />
                <RecentProjects />
                <div className="relative">
                    <ServicesSection />
                    <About />
                </div>
                <Skills />
                <Suspense fallback={<Loading />}>
                    <Certification />
                </Suspense>
                <Suspense fallback={<Loading />}>
                    <ContributionsGithub />
                </Suspense>
            </main>
        </>
    );
};

export default Home;
