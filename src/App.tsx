import { Suspense, useEffect, useRef } from 'react';
import { BrowserRouter as Router, useRoutes, useLocation } from 'react-router-dom';
import routes from '~react-pages';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import ThemeProviderContext from './context/ThemeProviderContext';
import ContainerProvider from './context/ContainerProvider';
import WelcomeProvider, { useWelcome } from './context/WelcomeProvider';
import MainLayout from './layouts/MainLayout';
import Loading from './components/Loading';
import PageTransition from './components/PageTransition';
import './App.css';
import { inject } from "@vercel/analytics";
import { BRAND_NAME } from "@/config/Identity";

const logoVariants = {
  initial: {
    scale: 0.8,
    opacity: 0,
    filter: "blur(20px)",
  },
  animate: {
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1] as const,
    }
  },
};

const charVariants = {
  initial: { opacity: 0, y: 20, filter: "blur(5px)" },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.5 + i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

function NeuralNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const numNodes = Math.min(Math.floor((width * height) / 14000), 55);
    const nodes = Array.from({ length: numNodes }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(147, 51, 234, 0.75)";
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-50" />;
}

function WelcomeScreen() {
  const name = BRAND_NAME;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.8, ease: "easeInOut" }
      }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-white dark:bg-neutral-950 overflow-hidden"
    >
      <NeuralNetworkCanvas />

      <motion.div className="relative z-10 flex flex-col items-center">
        <motion.div
          variants={logoVariants}
          initial="initial"
          animate="animate"
          className="relative mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-blue-500 blur-2xl rounded-full"
          />
          <img
            src="/icon.webp"
            alt={BRAND_NAME}
            className="relative w-28 h-28 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-white/10"
          />
        </motion.div>

        <div className="flex space-x-2">
          {name.split("").map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={charVariants}
              initial="initial"
              animate="animate"
              className="text-4xl md:text-5xl font-black tracking-tighter text-neutral-900 dark:text-white"
            >
              {char}
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 w-12 h-0.5 bg-neutral-200 dark:bg-neutral-800"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-8"
        >
          <Loading />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        <motion.div
          initial={{ height: 0 }}
          exit={{ height: "100%" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="absolute top-0 left-0 w-full bg-neutral-900 z-20"
        />
      </AnimatePresence>
    </motion.div>
  );
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[100] h-1 origin-left bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] pointer-events-none"
    />
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppRoutes() {
  const element = useRoutes(routes);

  if (!element) return null;

  return (
    <>
      <ScrollToTop />
      <PageTransition>
        {element}
      </PageTransition>
    </>
  );
}

function AppShell() {
  const { showWelcome, isWelcomeDone } = useWelcome();

  useEffect(() => {
    inject();
  }, []);

  return (
    <>
      <ScrollProgressBar />
      <AnimatePresence mode="wait">
        {showWelcome && <WelcomeScreen key="welcome" />}
      </AnimatePresence>
      <MainLayout>
        <Suspense fallback={<Loading classProps="min-h-screen" />}>
          {isWelcomeDone && <AppRoutes />}
        </Suspense>
      </MainLayout>
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProviderContext>
        <ContainerProvider>
          <WelcomeProvider>
            <AppShell />
          </WelcomeProvider>
        </ContainerProvider>
      </ThemeProviderContext>
    </Router>
  );
}

export default App;
