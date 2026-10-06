import MetadataConfig from "@/config/Metadata";
import { useTranslation } from "@/i18n";

const TEMPLATE_REPO_URL = "https://github.com/FIQTOR/fiqtor.com-create-your-own";

const Footer = () => {
  const metadata = MetadataConfig;
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="page-x flex h-fit w-full flex-wrap items-center justify-start gap-5 pb-24 md:pb-10 text-text-muted relative z-0">
      <span className="text-center font-medium">
        &copy; {currentYear} {t("footer.madeBy")} {metadata.authors.name} | {t("footer.rights")}
      </span>
      <a
        href={TEMPLATE_REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-ring font-medium underline underline-offset-4 decoration-neutral-300 dark:decoration-neutral-600 transition-colors hover:text-text-heading"
      >
        {t("footer.githubRepo")}
      </a>
    </footer>
  );
};

export default Footer;
