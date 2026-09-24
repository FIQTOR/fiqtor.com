// Import icons from react-icons/tb library
import {
  TbAward,
  TbBinaryTree,
  TbBuildingCommunity,
  TbHome,
  TbLayoutKanban,
  TbStack2,
} from "react-icons/tb";

// Define the structure for menu items
type Project = {
  label: string;    // Display text for the menu item
  Svg: any;         // Icon component to be displayed
  pathName: string; // Route path for navigation
};

// Export menu configuration array
export const Menu: Array<Project> = [
  {
    label: "Home",
    Svg: TbHome,
    pathName: "/",
  },
  {
    label: "Career",
    Svg: TbBuildingCommunity,
    pathName: "/career",
  },
  {
    label: "All Projects",
    Svg: TbStack2,
    pathName: "/projects",
  },
  {
    label: "Certification",
    Svg: TbAward,
    pathName: "/certification",
  },
  {
    label: "Linktree",
    Svg: TbBinaryTree,
    pathName: "/linktree",
  },
  {
    label: "Kanban",
    Svg: TbLayoutKanban,
    pathName: "/kanban",
  },
];
