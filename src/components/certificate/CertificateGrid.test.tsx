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
  {
    title: "LKS SMK East Java XXXII Web Technologies",
    published: "Apr 2024",
    srcImage: "/img/certificate/lks-cert.webp",
    srcImageSecondary: "/img/certificate/lks-scores.webp",
    secondaryLabel: "Official final score sheet — Rank 4 (69.75)",
    thisAcademic: true,
    tags: ["LKS"],
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

  it("shows both the certificate and the score sheet for a two-image cert", () => {
    renderGrid(<CertificatesGrid certificates={[certs[2]]} />);
    fireEvent.click(
      screen.getByRole("button", {
        name: /open certificate preview: LKS SMK East Java XXXII/i,
      }),
    );

    const dialog = screen.getByRole("dialog");
    const srcs = Array.from(dialog.querySelectorAll("img")).map((i) =>
      i.getAttribute("src"),
    );
    expect(srcs).toContain("/img/certificate/lks-cert.webp");
    expect(srcs).toContain("/img/certificate/lks-scores.webp");
    // The score-sheet caption is shown.
    expect(
      screen.getByText(/Official final score sheet — Rank 4/i),
    ).toBeInTheDocument();
  });
});
