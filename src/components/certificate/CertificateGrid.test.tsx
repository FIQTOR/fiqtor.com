import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ReactElement } from "react";
import CertificatesGrid from "@/modules/certification/components/CertificatesGrid";
import type { Certificate } from "@/components/certificate/CertificateCard";
import LanguageProvider from "@/i18n/LanguageProvider";

const certs: Certificate[] = [
  {
    title: "BNSP Portrait Certificate",
    published: "Jan 2025",
    srcImage: "/img/certificate/bnsp.webp",
    thisAcademic: true,
    tags: ["BNSP"],
  },
  {
    title: "Dicoding Front-End Certificate",
    published: "Oct 2025",
    srcImage: "/img/certificate/dicoding.webp",
    urlDirect: "https://www.dicoding.com/certificates/XYZ",
    thisAcademic: false,
    tags: ["HTML"],
  },
];

/** Render inside the real i18n provider so `t()` interpolates like production. */
const renderGrid = (ui: ReactElement) =>
  render(<LanguageProvider>{ui}</LanguageProvider>);

describe("CertificatesGrid", () => {
  it("opens the modal when the card body is clicked", () => {
    renderGrid(<CertificatesGrid certificates={[certs[0]]} />);

    // The interactive card exposes a role=button labelled with the cert title.
    const card = screen.getByRole("button", {
      name: /open certificate preview: BNSP Portrait Certificate/i,
    });
    fireEvent.click(card);

    // Modal renders a dialog with the certificate title + uncropped image.
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    const img = dialog.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", "/img/certificate/bnsp.webp");
    expect(img?.className).toContain("object-contain");
  });

  it("opens via keyboard (Enter) on the focused card", () => {
    renderGrid(<CertificatesGrid certificates={[certs[0]]} />);
    const card = screen.getByRole("button", {
      name: /open certificate preview: BNSP Portrait Certificate/i,
    });
    fireEvent.keyDown(card, { key: "Enter" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not open the modal when the external 'View' link is clicked", () => {
    renderGrid(<CertificatesGrid certificates={[certs[1]]} />);
    const view = screen.getByRole("link", { name: /view/i });
    fireEvent.click(view);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
