import {
  TbBulb,
  TbLayout2,
  TbRobot,
  TbSettingsAutomation
} from "react-icons/tb";

type Service = {
  SvgIcon: any;
  title: string;
  description: string;
};

export const Services: Array<Service> = [
  {
    SvgIcon: TbLayout2,
    title: "App Development",
    description:
      "Building high-performance applications across Web, Mobile, and Desktop platforms, ensuring seamless functionality and accessibility.",
  },
  {
    SvgIcon: TbRobot,
    title: "AI Integration",
    description:
      "Implementing advanced artificial intelligence and machine learning solutions to automate processes and enhance decision-making.",
  },
  {
    SvgIcon: TbBulb,
    title: "IT Consulting",
    description:
      "Expert guidance and strategic planning to help your business leverage technology for maximum growth and efficiency.",
  },
  {
    SvgIcon: TbSettingsAutomation,
    title: "Automation Everything",
    description:
      "Growing your business by automating repetitive workflows, integration processes, and scaling operational efficiency.",
  },
];
