import MetadataConfig from "@/config/Metadata";

const TEMPLATE_REPO_URL = "https://github.com/FIQTOR/fiqtor.com-create-your-own";

const Footer = () => {
  const metadata = MetadataConfig;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex h-fit w-full flex-wrap items-center justify-start px-20 gap-5 pb-24 md:pb-10 dark:text-neutral-300 z-0 relative">
      <span className="text-center font-medium text-neutral-600 dark:text-neutral-400">
        &copy; {currentYear} Made by {metadata.authors.name} | All
        rights reserved.
      </span>
      <a
        href={TEMPLATE_REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-neutral-600 dark:text-neutral-400 underline underline-offset-4 decoration-neutral-300 dark:decoration-neutral-600 transition-colors hover:text-neutral-900 dark:hover:text-white"
      >
        Portfolio template
      </a>
    </footer>
  );
};

export default Footer;
