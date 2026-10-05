import {
  TbBulb,
  TbLayout2,
  TbRobot,
  TbSettingsAutomation
} from "react-icons/tb";
import type { IconComponent } from "./icons";
import type { Language } from "@/i18n/translations";

type LocalizedText = Record<Language, string>;

type Service = {
  SvgIcon: IconComponent;
  title: LocalizedText;
  description: LocalizedText;
};

export const Services: Array<Service> = [
  {
    SvgIcon: TbLayout2,
    title: {
      en: "App Development",
      id: "Pengembangan Aplikasi",
    },
    description: {
      en: "Building high-performance applications across Web, Mobile, and Desktop platforms, ensuring seamless functionality and accessibility.",
      id: "Membangun aplikasi berperforma tinggi untuk platform Web, Mobile, dan Desktop, memastikan fungsionalitas dan aksesibilitas yang mulus.",
    },
  },
  {
    SvgIcon: TbRobot,
    title: {
      en: "AI Integration",
      id: "Integrasi AI",
    },
    description: {
      en: "Implementing advanced artificial intelligence and machine learning solutions to automate processes and enhance decision-making.",
      id: "Menerapkan solusi kecerdasan buatan dan machine learning tingkat lanjut untuk mengotomatiskan proses dan meningkatkan pengambilan keputusan.",
    },
  },
  {
    SvgIcon: TbBulb,
    title: {
      en: "IT Consulting",
      id: "Konsultasi IT",
    },
    description: {
      en: "Expert guidance and strategic planning to help your business leverage technology for maximum growth and efficiency.",
      id: "Panduan ahli dan perencanaan strategis untuk membantu bisnis Anda memanfaatkan teknologi demi pertumbuhan dan efisiensi maksimal.",
    },
  },
  {
    SvgIcon: TbSettingsAutomation,
    title: {
      en: "Automation Everything",
      id: "Otomatisasi Segalanya",
    },
    description: {
      en: "Growing your business by automating repetitive workflows, integration processes, and scaling operational efficiency.",
      id: "Menumbuhkan bisnis Anda dengan mengotomatiskan alur kerja berulang, proses integrasi, dan meningkatkan efisiensi operasional.",
    },
  },
];
