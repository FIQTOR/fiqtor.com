import {
  TbLanguage,
  TbLayoutDashboard,
  TbDatabase,
  TbGitFork,
  TbBrandVscode,
} from "react-icons/tb";
import { Anim } from "@/components/Lottie";
import {
  BackendSkills,
  OtherSkills,
  FrontendSkills,
  LanguageSkills,
} from "../components/skill-icon";
import * as motion from "framer-motion/client";

interface SkillSectionItemProps {
  Icon: React.ElementType;
  title: string;
  SkillsComponent: React.FC;
}

const SkillSectionItem: React.FC<SkillSectionItemProps> = ({ Icon, title, SkillsComponent }) => (
  <div className="flex flex-col gap-5 md:gap-7 lg:flex-row">
    <span className="flex h-fit w-fit min-w-[180px] items-center gap-2 rounded-full border-t border-neutral-300 py-3 pl-7 shadow-xl backdrop-blur-md dark:border-neutral-700 md:text-xl">
      <Icon strokeWidth="1.5" className="h-7 w-7" />
      {title}
    </span>
    <ul className="mt-2 flex flex-wrap gap-3 md:gap-5">
      <SkillsComponent />
    </ul>
  </div>
);

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="flex w-full flex-col gap-5 px-7 font-light text-neutral-700 dark:text-neutral-300 md:px-24"
    >
      <div className="relative flex flex-col items-center">
        <div className="absolute -left-[200px] top-[400px] hidden h-[400px] w-[400px] rounded-full bg-orange-400/40 opacity-70 blur-3xl dark:bg-neutral-600 md:block"></div>
        <div className="absolute -left-[200px] top-0 hidden h-[500px] w-[800px] rounded-full bg-purple-200 opacity-70 blur-3xl dark:bg-neutral-800 md:block"></div>

        <div className="flex gap-3 md:items-center">
          <TbBrandVscode strokeWidth="1" className="h-full w-14 md:w-20" />
          <div className="flex flex-col">
            <div className="flex gap-4">
              <span className="text-2xl md:text-4xl">Tech Stack</span>
              <span className="rocket-animate inline-block text-4xl">🚀</span>
            </div>
            <span className="md:text-xl">
              My tech stack for software development
            </span>
          </div>
        </div>
        <span className="mt-4 leading-none md:mt-0 md:leading-normal">
          You can hover the icon to show skill name.
        </span>
      </div>
      <div className="flex w-full items-center">
        <div className="z-10 flex w-full flex-col items-start gap-7 text-neutral-600 dark:text-neutral-400 md:w-1/2">
          <SkillSectionItem Icon={TbLanguage} title="Language" SkillsComponent={LanguageSkills} />
          <SkillSectionItem Icon={TbLayoutDashboard} title="Frontend" SkillsComponent={FrontendSkills} />
          <SkillSectionItem Icon={TbDatabase} title="Backend" SkillsComponent={BackendSkills} />
          <SkillSectionItem Icon={TbGitFork} title="Other" SkillsComponent={OtherSkills} />
        </div>

        <div className="absolute left-0 w-full blur-sm md:relative md:w-1/2 md:blur-none">
          <motion.div
            initial={{ opacity: 0, rotateZ: "-45deg", scale: 0, x: 300 }}
            whileInView={{ opacity: 1, rotateZ: "0deg", scale: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            className="md:scale-90"
          >
            <Anim />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
