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
    // Abort in-flight requests on unmount so we never setState after the
    // component is gone (e.g. fast route changes).
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        // Our backend fetches the follower counts REALTIME (public profile
        // scrape) and already degrades to cached/default numbers, so this
        // request always returns a usable payload. We only need a local
        // fallback for the case where the backend itself is unreachable.
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/v1/social/stats`,
          { signal }
        );
        const { tiktok, instagram } = response.data?.data ?? {};

        setTiktok({
          followers: tiktok?.followers ?? 0,
          following: tiktok?.following ?? 0
        });

        setInstagram({
          followers: instagram?.followers ?? 0,
          following: instagram?.following ?? 0
        });
      } catch {
        if (signal.aborted) return;
        console.log("Failed to fetch stats, using fallback data.");
        // Fallback data when the backend itself is unavailable.
        setTiktok({ followers: 2006, following: 49 });
        setInstagram({ followers: 671, following: 572 });
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/v1/wakatime`,
          { signal }
        );
        const data = response.data?.data;
        // Guard against a partial payload: a missing `text` must not throw and
        // wrongly drop us into the "Maintenance" branch. `replace` is applied
        // globally so multi-unit strings ("2 hrs 3 mins") are fully expanded.
        const text =
          typeof data?.text === "string"
            ? data.text.replace(/hrs/g, "hours").replace(/mins/g, "minutes")
            : "";
        setWakatime({
          coding_lifetime: text,
          since: data?.range?.start_text ?? ""
        });
      } catch {
        if (signal.aborted) return;
        setWakatime({
          coding_lifetime: '',
          since: '(Maintenance)'
        });
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!wakatimeRef.current || !tiktokRef.current || !instagramRef.current || !containerRef.current) return;

    // Capture non-null elements so their types stay narrowed inside the context.
    const wakatimeEl = wakatimeRef.current;
    const tiktokEl = tiktokRef.current;
    const instagramEl = instagramRef.current;
    const containerEl = containerRef.current;
    // Only pin on desktop: a pinned 200vh section hijacks touch scrolling on
    // phones (the page "grabs" the finger). On mobile we instead let the section
    // scroll normally and drive the same cross-fade from scroll progress, so the
    // section still follows the scroll like desktop — without the pin.
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    // Mobile uses a shorter travel distance so fewer pixels are repainted per frame.
    const travel = isDesktop ? 100 : 32;

    const ctx = gsap.context(() => {
      const cards: [HTMLDivElement, number][] = [
        [wakatimeEl, 1],
        [tiktokEl, 2],
        [instagramEl, 3]
      ];

      // Set initial states
      gsap.set([wakatimeEl, tiktokEl, instagramEl], {
        opacity: 0,
        y: travel
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerEl,
          // Pin the container so its TOP sits at the viewport top. The cards are
          // centred with `top-1/2` inside a one-viewport-tall layer, so anchoring
          // the container at the viewport top lands them at the true vertical
          // centre. (With "top center" the pinned container's top stayed on the
          // viewport centre line, pushing the cards half a screen too low.)
          start: isDesktop ? "top top" : "top 70%",
          end: isDesktop ? "bottom bottom" : "bottom 60%",
          pin: isDesktop,
          scrub: isDesktop ? 1 : 0.5,
          anticipatePin: isDesktop ? 1 : 0,
          fastScrollEnd: true
          // markers: true
        }
      });

      cards.forEach(([el, zIndex], i) => {
        // Bring the card in.
        tl.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          immediateRender: false,
          zIndex
        }, i === 0 ? "<" : "-=0.5");

        if (isDesktop) {
          // Per-character reveal (desktop only): one tween per glyph animating
          // scale + opacity. This is the heavy part — skipped on mobile.
          tl.to(el.querySelectorAll('.animate-text'), {
            opacity: 1,
            scale: 1,
            stagger: 0.1,
            duration: 0.5,
            ease: "back.out(1.7)",
            immediateRender: false,
            zIndex
          }, ">-0.5");
        } else {
          // Mobile: reveal the whole heading block in one cheap step instead of
          // staggering dozens of individual characters.
          tl.set(el.querySelectorAll('.animate-text'), {
            opacity: 1,
            scale: 1
          }, ">-0.5");
        }

        // Send the card out — except the last, which is where we land.
        if (i < cards.length - 1) {
          tl.to(el, {
            opacity: 0,
            y: -travel,
            duration: 1,
            immediateRender: false,
            zIndex: 0
          }, "+=1");
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (

    <>
      <div
        ref={containerRef}
        className="relative flex min-h-[140vh] w-full flex-col items-center md:min-h-[200vh]"
      >
        {/*
          Positioning layer for the three cards.
          - Desktop: pinned container fills the viewport while pinned, so this
            layer is exactly one viewport tall and top-anchored; `top-1/2` on the
            cards then centres them in the *visible* area. (Using the container's
            full 200vh height here pushed the cards ~100vh down, i.e. off-screen.)
          - Mobile: `sticky` full-viewport layer so the cards stay centred while the
            tall container scrolls past — the section "follows" the scroll like
            desktop, without ScrollTrigger's pin hijacking the touch scroller.
        */}
        <div className="sticky top-0 z-10 flex h-[100svh] w-full items-center justify-center md:absolute md:left-0 md:top-0 md:h-screen">
        <div
          ref={wakatimeRef}
          className="flex flex-col items-center justify-center space-y-4 absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2"
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
            href={`https://wakatime.com/@${WakatimeConfig.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-white rounded-full text-xl hover:bg-white/90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 text-black"
          >
            Visit Wakatime Profile
          </a>
        </div>


        <div
          ref={tiktokRef}
          className="flex flex-col items-center justify-center space-y-4 absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2"
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
          className="flex flex-col items-center justify-center space-y-4 absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2"
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
      </div>
    </>
  );
};

export default SubHeader;