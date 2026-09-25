import { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

interface CounterProps {
  start: number;
  end: number;
}

const CounterAnimation: React.FC<CounterProps> = ({
  start,
  end,
}: CounterProps) => {
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    anime({
      targets: numberRef.current,
      innerHTML: [start, end],
      round: 1, // Membulatkan angka
      easing: "easeInOutBounce",
      duration: 6000, // Durasi animasi dalam milisecond
      update: function (anim) {
        if (numberRef.current) {
          const target = anim.animatables[0]?.target as unknown as HTMLElement;
          numberRef.current.innerText = Math.round(
            Number(target?.innerHTML ?? start),
          ).toString();
        }
      },
    });
  }, [start, end]);

  return <span ref={numberRef}>{start}</span>;
};

export default CounterAnimation;
