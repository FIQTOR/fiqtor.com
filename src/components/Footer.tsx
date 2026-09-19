import MetadataConfig from "@/config/Metadata";

const Footer = () => {
  const metadata: any = MetadataConfig;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex h-fit w-full justify-start px-20 gap-5 pb-24 md:pb-10 dark:text-neutral-300 z-0 relative">
      <span className="text-center font-medium text-neutral-600 dark:text-neutral-400">
        &copy; {currentYear} Made by {metadata.authors.name}{" "}
        {metadata.authors.alias && `(alias ${metadata.authors.alias})`} | All
        rights reserved.
      </span>
    </footer>
  );
};

export default Footer;
