import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import { SOCIAL_LINKS } from "@/config/Identity";
import WakatimeConfig from "@/config/Wakatime";

gsap.registerPlugin(ScrollTrigger);

// Mobile browsers fire resize constantly as the address bar shows/hides during
// scroll. Without this, ScrollTrigger recomputes pin positions on every tick
// and the 300vh pinned section janks hard. Ignoring those resizes keeps the
// same visual effect while eliminating the thrash.
ScrollTrigger.config({ ignoreMobileResize: true });

const SubHeader = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wakatimeRef = useRef<HTMLDivElement>(null);
  const tiktokRef = useRef<HTMLDivElement>(null);
  const instagramRef = useRef<HTMLDivElement>(null);
  const [wakatime, setWakatime] = useState({ coding_lifetime: '', since: '' });
  const [tiktok, setTiktok] = useState({ followers: 0, following: 0 });
  const [instagram, setInstagram] = useState({ followers: 0, following: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Stats are served by OUR backend as static data — no third-party
        // API keys or scraping, and nothing secret reaches the browser.
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/v1/social/stats`
        );
        const { tiktok, instagram } = response.data.data;

        setTiktok({
          followers: tiktok.followers,
          following: tiktok.following
        });

        setInstagram({
          followers: instagram.followers,
          following: instagram.following
        });
      } catch {
        console.log("Gagal mengambil stats, menggunakan data fallback.");
        // Fallback data jika backend tidak tersedia
        setTiktok({ followers: 1977, following: 30 });
        setInstagram({ followers: 691, following: 577 });
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/wakatime`);
        setWakatime({
          coding_lifetime: response.data.data.text.replace("hrs", "hours")
            .replace("mins", "minutes"),
          since: response.data.data.range.start_text
        });
      } catch {
        // console.log(err);
        setWakatime({
          coding_lifetime: '',
          since: '(Maintenance)'
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!wakatimeRef.current || !tiktokRef.current || !instagramRef.current || !containerRef.current) return;

    // Capture non-null elements so their types stay narrowed inside the context.
    const wakatimeEl = wakatimeRef.current;
    const tiktokEl = tiktokRef.current;
    const instagramEl = instagramRef.current;
    const containerEl = containerRef.current;
    // Only pin on desktop: a 200vh pinned section hijacks touch scrolling on
    // phones. On small screens the three stats simply fade/scroll normally.
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([wakatimeEl, tiktokEl, instagramEl], {
        opacity: 0,
        y: 100
      });

      // Animation timeline
      gsap.timeline({
        scrollTrigger: {
          trigger: containerEl,
          start: "top center",
          end: "bottom center",
          pin: isDesktop,
          scrub: 1,
          anticipatePin: 1,
          fastScrollEnd: true,
          // markers: true
        }
      })
        .to(wakatimeEl, {
          opacity: 1,
          y: 0,
          duration: 1,
          immediateRender: false,
          zIndex: 1
        })
        .to(wakatimeEl.querySelectorAll('.animate-text'), {
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.out(1.7)",
          immediateRender: false,
          zIndex: 1
        }, ">-0.5")
        .to(wakatimeEl, {
          opacity: 0,
          y: -100,
          duration: 1,
          immediateRender: false,
          zIndex: 0
        }, "+=1")
        .to(tiktokEl, {
          opacity: 1,
          y: 0,
          duration: 1,
          immediateRender: false,
          zIndex: 2
        }, "-=0.5")
        .to(tiktokEl.querySelectorAll('.animate-text'), {
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.out(1.7)",
          immediateRender: false,
          zIndex: 2
        }, ">-0.5")
        .to(tiktokEl, {
          opacity: 0,
          y: -100,
          duration: 1,
          immediateRender: false,
          zIndex: 0
        }, "+=1")
        .to(instagramEl, {
          opacity: 1,
          y: 0,
          duration: 1,
          immediateRender: false,
          zIndex: 3
        }, "-=1")
        .to(instagramEl.querySelectorAll('.animate-text'), {
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.out(1.7)",
          immediateRender: false,
          zIndex: 3
        }, ">-0.5")
        .to(instagramEl, {
          opacity: 0,
          y: -100,
          duration: 1,
          immediateRender: false,
          zIndex: 0
        }, "+=1");
    });

    return () => ctx.revert();
  }, []);

  return (

    <>
      <div
        ref={containerRef}
        className="relative flex min-h-[140vh] w-full flex-col items-center md:min-h-[200vh]"
      >
        <div
          ref={wakatimeRef}
          className="flex flex-col items-center justify-center space-y-4 absolute  -translate-y-1/2"
        >
          <div className="relative w-full px-4 md:px-0">
            <h3 className="sr-only">Coding Lifetime</h3>
            <div
              aria-hidden="true"
              className="flex items-center justify-center flex-wrap gap-2 md:gap-3 max-w-[90vw] md:max-w-none mx-auto"
            >
              {"Coding Lifetime".split(" ").map((word, i) => (
                <div key={i} className="flex items-center justify-center">
                  {word.split("").map((char, charIndex) => (
                    <span
                      key={`${i}-${charIndex}`}
                      className="animate-text text-3xl sm:text-4xl md:text-6xl lg:text-9xl font-bold opacity-0 scale-0 transform inline-block"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-12 text-2xl md:text-3xl">
            {wakatime.coding_lifetime === '' ? <p className="font-semibold">Maintenance</p> :
              <>
                <p className="text-gray-600 dark:text-gray-400">{wakatime.coding_lifetime}</p>
                <p className="font-semibold">Since {wakatime.since}</p>
              </>}
          </div>
          <a
            href={`https://www.wakatime.com/${WakatimeConfig.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-white rounded-full text-xl hover:bg-white/90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 text-black"
          >
            Visit Wakatime Profile
          </a>
        </div>


        <div
          ref={tiktokRef}
          className="flex flex-col items-center justify-center space-y-4 absolute  -translate-y-1/2"
        >
          <div className="relative w-full px-4 md:px-0">
            <h3 className="sr-only">Follow my Tiktok</h3>
            <div
              aria-hidden="true"
              className="flex items-center justify-center flex-wrap gap-2 md:gap-3 max-w-[90vw] md:max-w-none mx-auto"
            >
              {"Follow My Tiktok".split(" ").map((word, i) => (
                <div key={i} className="flex items-center justify-center">
                  {word.split("").map((char, charIndex) => (
                    <span
                      key={`${i}-${charIndex}`}
                      className="animate-text text-3xl sm:text-4xl md:text-6xl lg:text-9xl font-bold opacity-0 scale-0 transform inline-block"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-12 text-2xl md:text-3xl">
            <p className="font-semibold">{tiktok.followers} followers</p>
            <p className="text-gray-600 dark:text-gray-400">{tiktok.following} following</p>
          </div>
          <a
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-white rounded-full text-xl hover:bg-white/90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 text-black"
          >
            Visit TikTok Profile
          </a>
        </div>

        <div
          ref={instagramRef}
          className="flex flex-col items-center justify-center space-y-4 absolute  -translate-y-1/2"
        >
          <div className="relative w-full px-4 md:px-0">
            <h3 className="sr-only">Connect my Instagram</h3>
            <div
              aria-hidden="true"
              className="flex items-center justify-center flex-wrap gap-2 md:gap-3 max-w-[90vw] md:max-w-none mx-auto"
            >
              {"Follow My Instagram".split(" ").map((word, i) => (
                <div key={i} className="flex items-center justify-center">
                  {word.split("").map((char, charIndex) => (
                    <span
                      key={`${i}-${charIndex}`}
                      className="animate-text text-3xl sm:text-4xl md:text-6xl lg:text-9xl font-bold opacity-0 scale-0 transform inline-block"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-12 text-2xl md:text-3xl">
            <p className="font-semibold">{instagram.followers} followers</p>
            <p className="text-gray-600 dark:text-gray-400">{instagram.following} following</p>
          </div>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-white rounded-full text-xl hover:bg-white/90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 text-black"
          >
            Visit Instagram Profile
          </a>
        </div>
      </div>
    </>
  );
};

export default SubHeader;