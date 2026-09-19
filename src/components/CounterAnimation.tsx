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
      update: function (anim: any) {
        if (numberRef.current) {
          numberRef.current.innerText = Math.round(
            anim.animatables[0].target.innerHTML,
          ).toString();
        }
      },
    });
  }, [start, end]);

  return <span ref={numberRef}>{start}</span>;
};

export default CounterAnimation;
