// Import icons from react-icons/tb library
import {
  TbAward,
  TbBinaryTree,
  TbBuildingCommunity,
  TbHome,
  TbLayoutKanban,
  TbStack2,
} from "react-icons/tb";
import type { IconComponent } from "./icons";
import type { TranslationKey } from "@/i18n/translations";

// Define the structure for menu items
export type Project = {
  label: string;                  // Fallback display text (English)
  labelKey: TranslationKey;       // i18n key for the display text
  Svg: IconComponent;             // Icon component to be displayed
  pathName: string;               // Route path for navigation
};

// Export menu configuration array
export const Menu: Array<Project> = [
  {
    label: "Home",
    labelKey: "nav.home",
    Svg: TbHome,
    pathName: "/",
  },
  {
    label: "Career",
    labelKey: "nav.career",
    Svg: TbBuildingCommunity,
    pathName: "/career",
  },
  {
    label: "All Projects",
    labelKey: "nav.projects",
    Svg: TbStack2,
    pathName: "/projects",
  },
  {
    label: "Certification",
    labelKey: "nav.certification",
    Svg: TbAward,
    pathName: "/certification",
  },
  {
    label: "Linktree",
    labelKey: "nav.linktree",
    Svg: TbBinaryTree,
    pathName: "/linktree",
  },
  {
    label: "Kanban",
    labelKey: "nav.kanban",
    Svg: TbLayoutKanban,
    pathName: "/kanban",
  },
];
