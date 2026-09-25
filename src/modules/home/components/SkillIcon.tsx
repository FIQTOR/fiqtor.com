import { Skills } from "@/data/skills";
import type { Item } from "@/data/skills";
import { ContainerContext } from "@/context/container-context";
import { motion } from 'framer-motion';
import { useContext } from "react";

export const LanguageSkills = () => {
  const { isTiny } = useContext(ContainerContext);
  return (
    <>
      {Skills.language?.map((icon: Item, index: number) => (
        <li
          key={index}
          className="relative cursor-pointer group"
        >
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full backdrop-blur-xs shadow-xl bg-neutral-300/30 dark:bg-neutral-800/50 px-3 py-1 text-sm text-black dark:text-white opacity-0 scale-0 translate-y-10 transition-all duration-200 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
            {icon.tooltip}
          </span>
          <div className="absolute h-10 w-10 scale-0 cursor-pointer rounded-full bg-neutral-400 blur-lg duration-300 dark:bg-white"></div>
          <IconSkills icon={icon} animation={!isTiny} index_={index} />
        </li>
      ))}
    </>
  );
};
export const FrontendSkills = () => {
  const { isTiny } = useContext(ContainerContext);
  return (
    <>
      {Skills.frontend?.map((icon: Item, index: number) => (
        <li
          key={index}
          className="relative cursor-pointer group"
        >
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full backdrop-blur-xs shadow-xl bg-neutral-300/30 dark:bg-neutral-800/50 px-3 py-1 text-sm text-black dark:text-white opacity-0 scale-0 translate-y-10 transition-all duration-200 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
            {icon.tooltip}
          </span>
          <div className="absolute h-10 w-10 scale-0 rounded-full bg-neutral-400 blur-lg duration-300 dark:bg-white"></div>
          <IconSkills icon={icon} animation={!isTiny} index_={index} />
        </li>
      ))}
    </>
  );
};
export const BackendSkills = () => {
  const { isTiny } = useContext(ContainerContext);
  return (
    <>
      {Skills.backend?.map((icon: Item, index: number) => (
        <li
          key={index}
          className="relative cursor-pointer group"
        >
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full backdrop-blur-xs shadow-xl bg-neutral-300/30 dark:bg-neutral-800/50 px-3 py-1 text-sm text-black dark:text-white opacity-0 scale-0 translate-y-10 transition-all duration-200 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
            {icon.tooltip}
          </span>
          <div className="absolute h-10 w-10 scale-0 rounded-full bg-neutral-400 blur-lg duration-300 dark:bg-white"></div>
          <IconSkills icon={icon} animation={!isTiny} index_={index} />
        </li>
      ))}
    </>
  );
};
export const OtherSkills = () => {
  const { isTiny } = useContext(ContainerContext);
  return (
    <>
      {Skills.other?.map((icon: Item, index: number) => (
        <li
          key={index}
          className="relative cursor-pointer group"
        >
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full backdrop-blur-xs shadow-xl bg-neutral-300/30 dark:bg-neutral-800/50 px-3 py-1 text-sm text-black dark:text-white opacity-0 scale-0 translate-y-10 transition-all duration-200 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
            {icon.tooltip}
          </span>
          <div className="absolute h-10 w-10 scale-0 rounded-full bg-neutral-400 blur-lg duration-300 dark:bg-white group-hover:scale-100"></div>
          <IconSkills icon={icon} animation={!isTiny} index_={index} />
        </li>

      ))}
    </>
  );
};

interface IconSkillsProps {
  icon: Item;
  animation: boolean;
  index_: number;
}

const IconSkills = ({ icon, animation, index_ }: IconSkillsProps) => (
  <motion.div
    initial={!animation ? {} : { opacity: 0, filter: "blur(15px)", y: 50 }}
    whileInView={!animation ? {} : { opacity: 1, filter: "blur(0px)", y: 0 }}
    transition={!animation ? {} : { delay: 0.3 * index_ }}
    viewport={!animation ? {} : { once: true, amount: 0.8 }}
  >
    <icon.SvgIcon className="h-10 w-10" />
  </motion.div>
);
